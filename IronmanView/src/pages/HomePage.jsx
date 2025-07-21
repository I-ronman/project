// src/pages/HomePage.jsx
import React from 'react';
import Header from '../components/Header';
import FooterNav from '../components/FooterNav';

const HomePage = () => {
  const dummyUser = {
    name: '홍길동',
    profileImage: 'https://i.pravatar.cc/50?img=3',
  };

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      <Header user={dummyUser} />

      <main className="p-4 space-y-4">
        <section className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
          <span className="text-xl font-bold">오늘 루틴시작</span>
          <button className="bg-gray-600 px-4 py-2 rounded">루틴 A ▶</button>
        </section>

        <section className="grid grid-cols-2 gap-4">
          <div className="bg-gray-700 p-4 rounded text-center">
            <h2 className="text-lg font-bold">루틴 짜기/추천받기</h2>
            <p className="text-sm mt-1">직접 짜거나 추천받아보세요</p>
          </div>
          <div className="bg-gray-700 p-4 rounded text-center">
            <h2 className="text-lg font-bold">맞춤 설정</h2>
            <p className="text-sm mt-1">루틴 추천을 위한 설정</p>
          </div>
        </section>

        <section className="bg-gray-700 p-4 rounded text-center">
          <h3 className="text-lg">주간 목표</h3>
          <div className="text-3xl font-bold mt-2">5/7</div>
        </section>

        <section className="bg-gray-700 p-4 rounded">
          <h3 className="text-lg font-bold mb-2">🏆 랭킹</h3>
          <ul className="space-y-1">
            <li>🥇 신라면</li>
            <li>🥈 진라면</li>
            <li>🥉 짜파게티</li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-bold mb-2">운동 프로그램</h3>
          <div className="grid grid-cols-4 gap-2 text-center">
            <button className="bg-lime-400 text-black py-2 rounded">유산소</button>
            <button className="bg-gray-700 py-2 rounded">근력 운동</button>
            <button className="bg-gray-700 py-2 rounded">스트레칭</button>
            <button className="bg-gray-700 py-2 rounded">전신 운동</button>
          </div>
        </section>
      </main>

      <FooterNav />
    </div>
  );
};

export default HomePage;
