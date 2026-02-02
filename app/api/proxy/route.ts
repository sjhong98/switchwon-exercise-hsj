import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = 'https://exchange-example.switchflow.biz';

export async function GET(req: NextRequest) {
  // url은 parameter로, body는 body로 받는 통일 구조
  const url = req.nextUrl.searchParams.get('url');

  // url을 제외한 parameter
  const params = req.nextUrl.searchParams;
  params.delete('url');

  const res = await fetch(`${BASE_URL}${url}?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': req.headers.get('Content-Type') ?? 'application/json',
      'Authorization': req.headers.get('Authorization') ?? '',
    },
  });
  // 응답값을 변형하지 않고 그대로 반환
  return new NextResponse(await res.text(), {
    status: res.status,
    headers: res.headers,
  });
}

export async function POST(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');
  const bodyData = await req.json();
  const res = await fetch(`${BASE_URL}${url}`, {
    method: 'POST',
    headers: {
      'Content-Type': req.headers.get('Content-Type') ?? 'application/json',
      'Authorization': req.headers.get('Authorization') ?? '',
    },
    body: bodyData ? JSON.stringify(bodyData) : undefined,
  });
  return new NextResponse(await res.text(), {
    status: res.status,
    headers: res.headers,
  });
}

export async function PUT(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');
  const bodyData = await req.json();
  const res = await fetch(`${BASE_URL}${url}`, {
    method: 'PUT',
    headers: {
      'Content-Type': req.headers.get('Content-Type') ?? 'application/json',
      'Authorization': req.headers.get('Authorization') ?? '',
    },
    body: bodyData ? JSON.stringify(bodyData) : undefined,
  });
  return new NextResponse(await res.text(), {
    status: res.status,
    headers: res.headers,
  });
}

export async function DELETE(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');

  const params = req.nextUrl.searchParams;
  params.delete('url');

  const res = await fetch(`${BASE_URL}${url}?${params.toString()}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': req.headers.get('Content-Type') ?? 'application/json',
      'Authorization': req.headers.get('Authorization') ?? '',
    },
  });
  return new NextResponse(await res.text(), {
    status: res.status,
    headers: res.headers,
  });
}

