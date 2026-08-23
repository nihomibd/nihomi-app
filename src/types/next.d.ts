declare module 'next/server' {
  export class NextResponse extends Response {
    static redirect(url: string | URL, status?: number): NextResponse;
    static json(body: any, init?: ResponseInit): NextResponse;
    static next(init?: ResponseInit): NextResponse;
  }
}
