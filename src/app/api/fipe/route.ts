import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get('path') || 'carros/marcas';

  try {
    const response = await fetch(`https://parallelum.com.br/fipe/api/v1/${path}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();

    return NextResponse.json(data, {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err) {
    console.error('FIPE API Error:', err);
    return NextResponse.json(
      { error: 'Erro ao buscar dados da FIPE.' },
      { status: 500 }
    );
  }
}
