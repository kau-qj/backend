const { pool } = require("../config/database");
const { logger } = require("../config/winston");

const userDao = require("../dao/userDao");

// Provider: Read 비즈니스 로직 처리

const generateFakeData = () => {
  const courseNames = [
    "프로그래밍입문",
    "컴퓨터구조론",
    "객체지향프로그래밍",
    "알고리즘해석및설계",
    "시스템프로그래밍",
    "AI프로그래밍",
    "AI입문",
    "Adventure Design",
    "데이터베이스기초",
    "산학프로젝트",
    "웹SW스튜디오 및 재능기부",
    "IoT",
    "정보보호",
    "데이터사이언스응용",
    "딥러닝응용",
    "인공지능플래닝",
    "임베디드SW입문"
  ];
  
  const courseDescriptions = [
    "C언어를 통해 프로그래밍 기초를 학습합니다.",
    "컴퓨터 구조 및 동작 원리를 이해합니다.",
    "Kotlin 언어를 통해 객체지향 프로그래밍에 대해 배웁니다.",
    "알고리즘 이론을 분석하고 설계합니다.",
    "시스템 프로그래밍 개념을 이해하고 구현합니다.",
    "인공 지능 프로그래밍을 학습합니다.",
    "인공 지능의 역사와 발전 과정을 살펴봅니다.",
    "아이디어 기획과 디자인에 대해 학습합니다.",
    "데이터베이스 기초를 이해하고 사용합니다.",
    "기획을 바탕으로 서비스를 개발하고 배포합니다.",
    "웹에 대한 지식을 습득하고, 웹 개발을 진행합니다.",
    "사물 인터넷 기술을 학습합니다.",
    "정보 보안과 보호에 대해 배웁니다.",
    "데이터 과학과 응용에 대한 이해를 향상시킵니다.",
    "딥러닝 및 기계 학습을 적용합니다.",
    "인공 지능 기획 및 개발을 학습합니다.",
    "임베디드 소프트웨어 및 아두이노와 라즈베리파이를 다룹니다."
  ];
  
  const myInterest = "백엔드(서버) 개발자";

  return { courseNames, courseDescriptions, myInterest };
};

module.exports = { generateFakeData };