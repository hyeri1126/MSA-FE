import { NextResponse } from 'next/server';
import springClient from '@/lib/springClient';
import { setAccessToken } from '@/utils/auth';

export async function POST(request) {
    try {
      // 클라이언트에서 보낸 데이터 받기
      const { email, password } = await request.json();
  
      // Spring Boot로 로그인 요청
      const response = await springClient.post('/user/president/login', { email, password });
  
      const { accessToken } = response.data; // Spring Boot에서 받은 토큰
    
     
      setAccessToken(accessToken);

      // 성공 응답 반환
      return NextResponse.json({ success: true });
    } catch (error) {
      if (error.response) {
       
        return NextResponse.json(
          { message: error.response.data.message },
          { status: error.response.status }  // 400, 404 등 Spring Boot에서 온 상태 코드 유지
        );
      }
      return NextResponse.json(
        { message: '서버와 통신 중 오류가 발생했습니다.' },
        { status: 500 }  // 서버 에러 상태 코드
      );
    }
}