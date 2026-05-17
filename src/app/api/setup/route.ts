import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'

// Service role key bypasses RLS — only use server-side
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
    try {
        const { orgName, adminUsername, adminPassword } = await request.json()

        if (!orgName?.trim() || !adminUsername?.trim() || !adminPassword?.trim()) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
        }

        // 1. Pre-check: ensure username doesn't already exist
        const { data: existing } = await supabaseAdmin
            .from('users')
            .select('id')
            .eq('username', adminUsername.trim())
            .maybeSingle()

        if (existing) {
            return NextResponse.json(
                { error: `Username "${adminUsername}" is already taken. Please choose a different admin username.` },
                { status: 409 }
            )
        }

        // 2. Create Organisation
        const { data: org, error: orgError } = await supabaseAdmin
            .from('organisations')
            .insert([{ name: orgName.trim() }])
            .select()
            .maybeSingle()

        if (orgError || !org) {
            console.error('Setup: org insert failed:', orgError)
            return NextResponse.json(
                { error: orgError?.message || 'Failed to create organisation' },
                { status: 500 }
            )
        }

        // 3. Hash password — never store plain text
        const passwordHash = await bcrypt.hash(adminPassword, 12)

        // 4. Create Admin User
        const { data: user, error: userError } = await supabaseAdmin
            .from('users')
            .insert([{
                username: adminUsername.trim(),
                email: adminUsername.trim(),
                password_hash: passwordHash,
                role: 'admin',
                is_active: true,
            }])
            .select()
            .maybeSingle()

        if (userError || !user) {
            console.error('Setup: user insert failed:', userError)
            // Rollback org to avoid orphan records
            await supabaseAdmin.from('organisations').delete().eq('id', org.id)

            // Friendly message for duplicate key edge case
            const message = userError?.code === '23505'
                ? `Username "${adminUsername}" is already taken. Please choose a different admin username.`
                : (userError?.message || 'Failed to create admin user')

            return NextResponse.json({ error: message }, { status: 409 })
        }

        // 5. Link User to Org
        const { error: linkError } = await supabaseAdmin
            .from('organisation_users')
            .insert([{ organisation_id: org.id, user_id: user.id }])

        if (linkError) {
            console.error('Setup: org_user link failed:', linkError)
            // Rollback both
            await supabaseAdmin.from('users').delete().eq('id', user.id)
            await supabaseAdmin.from('organisations').delete().eq('id', org.id)
            return NextResponse.json({ error: linkError.message }, { status: 500 })
        }

        return NextResponse.json({
            org: { id: org.id, name: org.name, createdAt: org.created_at },
            user: { id: user.id, username: user.username, email: user.email, role: user.role },
        })
    } catch (err: any) {
        console.error('Setup API error:', err)
        return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 })
    }
}
