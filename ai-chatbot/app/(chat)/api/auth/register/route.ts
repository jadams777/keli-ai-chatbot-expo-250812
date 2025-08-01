import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createUser, getUser } from '@/lib/db/queries';

const authFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = authFormSchema.parse(body);

    const existingUsers = await getUser(validatedData.email);
    if (existingUsers.length > 0) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      );
    }

    await createUser(validatedData.email, validatedData.password);
    const [newUser] = await getUser(validatedData.email);

    return NextResponse.json({ 
      user: {
        id: newUser.id,
        email: newUser.email
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    );
  }
} 