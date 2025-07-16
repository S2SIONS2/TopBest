'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';

import dropdown from '../../../public/dropdown.png'
import gamecard from '../../../public/gamecard.png'
import recommendGame from '../../../public/recommandedGame.png'
import review from '../../../public/review.png'
import thumbnail from '../../../public/thumbnail.png'

gsap.registerPlugin(ScrollTrigger);

export default function AboutPage() {
  const titleRef = useRef(null);
  const sectionsRef = useRef<HTMLElement[]>([]);

  useEffect(() => {
    gsap.fromTo(
      titleRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
    );

    sectionsRef.current.forEach((section, index) => {
      gsap.fromTo(
        section,
        { opacity: 0, y: 50 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 1, 
          ease: 'power3.out', 
          scrollTrigger: {
            trigger: section,
            start: 'top 80%', // When the top of the section hits 80% of the viewport
            toggleActions: 'play none none none', // Play animation once
          },
          delay: index * 0.2 // Stagger animations
        }
      );
    });
  }, []);

  const addSectionRef = (el: HTMLElement) => {
    if (el && !sectionsRef.current.includes(el)) {
      sectionsRef.current.push(el);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 ref={titleRef} className="text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
          TopBest Games: <br />
          유저 추천 기반 Steam 게임 랭킹
        </h1>
        <p className="text-xl text-gray-600 mb-12">
          TopBest Games는 Steam 게임에 대한 커뮤니티의 열정을 공유하고, 최고의 게임을 함께 찾아내는 플랫폼입니다.
          당신이 좋아하는 게임을 추천하고, 다른 사람들의 한줄평을 확인하며, 실시간으로 업데이트되는 랭킹을 즐겨보세요.
        </p>
      </div>

      <div className="max-w-5xl mx-auto space-y-20 mt-16">
        {/* Feature 1: 실시간 랭킹 보드 */}
        <section ref={addSectionRef} className="flex flex-col md:flex-row items-center gap-12 bg-white p-8 rounded-3xl shadow-xl">
          <div className="md:w-1/2">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">실시간 랭킹 보드</h2>
            <p className="text-lg text-gray-700 mb-6">
              커뮤니티의 추천을 기반으로 실시간으로 업데이트되는 Steam 게임 랭킹을 확인하세요.
              가장 인기 있는 게임부터 숨겨진 보석까지, 한눈에 파악할 수 있습니다.
            </p>
            <Image
              src={thumbnail}
              alt="게임 랭킹 보드 이미지"
              className="w-full h-64 bg-gray-200 rounded-xl flex items-center justify-center text-gray-500 text-xl font-semibold"
            />
            {/* <div className="w-full h-64 bg-gray-200 rounded-xl flex items-center justify-center text-gray-500 text-xl font-semibold">
              게임 랭킹 보드 이미지 영역
            </div> */}
          </div>
          <div className="md:w-1/2">
            <Image
              src={gamecard}
              alt="게임 소개 카드 이미지"
              className="w-full h-64 bg-gray-200 rounded-xl flex items-center justify-center text-gray-500 text-xl font-semibold"
            />
            {/* <div className="w-full h-64 bg-gray-200 rounded-xl flex items-center justify-center text-gray-500 text-xl font-semibold">
              게임 카드 이미지 영역
            </div> */}
          </div>
        </section>

        {/* Feature 2: 간편한 게임 추천 */}
        <section ref={addSectionRef} className="flex flex-col md:flex-row-reverse items-center gap-12 bg-white p-8 rounded-3xl shadow-xl">
          <div className="md:w-1/2">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">간편한 게임 추천</h2>
            <p className="text-lg text-gray-700 mb-6">
              좋아하는 Steam 게임을 쉽게 추천하고 커뮤니티에 공유하세요.
              간단한 검색과 몇 번의 클릭만으로 당신의 추천이 랭킹에 반영됩니다.
            </p>
            <Image
              src={recommendGame}
              alt="게임 추천 모달 이미지"
              className="w-full h-64 bg-gray-200 rounded-xl flex items-center justify-center text-gray-500 text-xl font-semibold"
            />
            {/* <div className="w-full h-64 bg-gray-200 rounded-xl flex items-center justify-center text-gray-500 text-xl font-semibold">
              게임 추천 모달 이미지 영역
            </div> */}
          </div>
          <div className="md:w-1/2">
            <Image
              src={dropdown}
              alt="검색 결과 드롭다운 이미지"
              className="w-full h-64 bg-gray-200 rounded-xl flex items-center justify-center text-gray-500 text-xl font-semibold"
            />
            {/* <div className="w-full h-64 bg-gray-200 rounded-xl flex items-center justify-center text-gray-500 text-xl font-semibold">
              검색 결과 드롭다운 이미지 영역
            </div> */}
          </div>
        </section>

        {/* Feature 3: 상세 정보 및 한줄평 */}
        <section ref={addSectionRef} className="flex flex-col md:flex-row items-center gap-12 bg-white p-8 rounded-3xl shadow-xl">
          <div className="md:w-1/2">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">상세 정보 및 한줄평</h2>
            <p className="text-lg text-gray-700 mb-6">
              각 게임의 상세 정보와 다른 사용자들의 생생한 한줄평을 확인하세요.
              당신만의 한줄평을 남겨 게임에 대한 애정을 표현할 수도 있습니다.
            </p>
            <Image
              src={dropdown}
              alt="게임 상세 모달 이미지"
              className="w-full h-64 bg-gray-200 rounded-xl flex items-center justify-center text-gray-500 text-xl font-semibold"
            />
            {/* <div className="w-full h-64 bg-gray-200 rounded-xl flex items-center justify-center text-gray-500 text-xl font-semibold">
              게임 상세 모달 이미지 영역
            </div> */}
          </div>
          <div className="md:w-1/2">
            <Image
              src={review}
              alt="한줄평 목록 이미지"
              className="w-full h-64 bg-gray-200 rounded-xl flex items-center justify-center text-gray-500 text-xl font-semibold"
            />
            {/* <div className="w-full h-64 bg-gray-200 rounded-xl flex items-center justify-center text-gray-500 text-xl font-semibold">
              한줄평 목록 이미지 영역
            </div> */}
          </div>
        </section>
      </div>
    </div>
  );
}
