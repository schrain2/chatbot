const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// ─── 상품 정보 ────────────────────────────────────────────────────────────────
const PRODUCTS = {
  37: {
    name: '슈레인 인도어 소고기+체중관리 2.5kg',
    shortName: '인도어 소고기+체중관리',
    price: 27000,
    protein: '40% 이상',
    flavor: '소고기',
    target: '실내묘 전 연령 (생후 2개월 이상)',
    kibble: '8mm 이하 소형 키블',
    feature: '실내 고양이 체중관리 특화\n콜드프레스 공법으로 소화 흡수율 향상',
    ingredients: '소고기, 감자, 콜드프레스 곡물 無\nLID(단일 단백질) 설계',
    imageUrl: 'https://ecimg.cafe24img.com/pg2547b04207977059/cndjrms30/web/product/big/20260129/fde42501677263b549c05d016fd3c5ac.jpg',
    pageUrl: 'https://xn--om2b15qn1d.com/product/detail.html?product_no=37&cate_no=1&display_group=2'
  },
  38: {
    name: '슈레인 입맛 까다로운 단백질 40%',
    shortName: '입맛 까다로운 단백질 40%',
    price: 20000,
    protein: '40%',
    flavor: '청어 & 감자',
    target: '전 연령 (생후 2개월 이상)',
    kibble: '8mm 이하 소형 키블',
    feature: '까다로운 식욕의 고양이를 위한 고기호성 사료\n개봉 시 신선한 향기로 식욕 자극',
    ingredients: '청어, 감자, 그레인프리\nLID(단일 단백질) 설계',
    imageUrl: 'https://ecimg.cafe24img.com/pg2547b04207977059/cndjrms30/web/product/big/20260129/4f39030fd759620da2b84d8227b7914b.jpg',
    pageUrl: 'https://xn--om2b15qn1d.com/product/detail.html?product_no=38&cate_no=1&display_group=2'
  }
};

// ─── 공통 퀵리플라이 (메인 메뉴) ──────────────────────────────────────────────
const MAIN_QR = [
  { label: '🛍 상품 목록', action: 'message', messageText: '상품 목록' },
  { label: '🛒 구매하기', action: 'message', messageText: '구매하기' },
  { label: '📦 배송 안내', action: 'message', messageText: '배송 안내' },
  { label: '🏷 브랜드 소개', action: 'message', messageText: '브랜드 소개' },
  { label: '❓ 자주 묻는 질문', action: 'message', messageText: '자주 묻는 질문' },
  { label: '📞 문의하기', action: 'message', messageText: '문의하기' }
];

// ─── 응답 빌더 ────────────────────────────────────────────────────────────────

function buildWelcome() {
  return {
    version: '2.0',
    template: {
      outputs: [
        {
          basicCard: {
            title: '안녕하세요! 🐱 SCHRAIN입니다',
            description: '슈레인 고양이 사료 공식 카카오 채널입니다.\n\n우리 아이가 먹는다는 마음으로\n정성껏 안전한 식품으로만 만들었습니다 💛\n\n아래 메뉴에서 원하시는 항목을 선택해 주세요!',
            thumbnail: {
              imageUrl: PRODUCTS[37].imageUrl
            },
            buttons: [
              {
                label: '🌐 홈페이지 방문',
                action: 'webLink',
                webLinkUrl: 'https://xn--om2b15qn1d.com/'
              }
            ]
          }
        }
      ],
      quickReplies: MAIN_QR
    }
  };
}

function buildFallback() {
  return {
    version: '2.0',
    template: {
      outputs: [
        {
          simpleText: {
            text: '죄송해요, 말씀하신 내용을 잘 이해하지 못했어요 😅\n\n아래 메뉴에서 선택해 주시거나\n궁금한 내용을 다시 입력해 주세요!'
          }
        }
      ],
      quickReplies: MAIN_QR
    }
  };
}

function buildProductList() {
  return {
    version: '2.0',
    template: {
      outputs: [
        {
          simpleText: {
            text: '🐱 SCHRAIN 고양이 사료\n\n그레인프리 · 고단백 · 순수 육류 원료\n까다로운 우리 아이를 위한 프리미엄 사료입니다!'
          }
        },
        {
          carousel: {
            type: 'commerceCard',
            items: Object.entries(PRODUCTS).map(([id, p]) => ({
              description: p.name,
              price: p.price,
              currency: 'won',
              discount: 0,
              thumbnails: [{ imageUrl: p.imageUrl, link: { web: p.pageUrl } }],
              profile: { nickname: 'SCHRAIN 슈레인' },
              buttons: [
                { label: '상세보기', action: 'webLink', webLinkUrl: p.pageUrl },
                { label: '구매하기', action: 'message', messageText: `${p.shortName} 구매하기` }
              ]
            }))
          }
        }
      ],
      quickReplies: [
        { label: '🐟 까다로운 단백질 40%', action: 'message', messageText: '입맛 까다로운 단백질 40% 구매하기' },
        { label: '🥩 인도어 소고기+체중관리', action: 'message', messageText: '인도어 소고기+체중관리 구매하기' },
        { label: '📦 배송 안내', action: 'message', messageText: '배송 안내' },
        { label: '❓ 자주 묻는 질문', action: 'message', messageText: '자주 묻는 질문' }
      ]
    }
  };
}

function buildProductDetail(productId) {
  const p = PRODUCTS[productId];
  return {
    version: '2.0',
    template: {
      outputs: [
        {
          basicCard: {
            title: p.name,
            description: `💰 가격: ${p.price.toLocaleString()}원\n🍖 단백질: ${p.protein}\n🐾 대상: ${p.target}\n🌾 그레인프리 · LID 설계\n\n✨ 특징\n${p.feature}\n\n🥩 원료\n${p.ingredients}\n\n📏 키블 크기: ${p.kibble}`,
            thumbnail: { imageUrl: p.imageUrl, fixedRatio: true },
            buttons: [
              { label: '상품 페이지 보기', action: 'webLink', webLinkUrl: p.pageUrl },
              { label: '구매 신청하기', action: 'message', messageText: `${p.shortName} 구매하기` }
            ]
          }
        }
      ],
      quickReplies: [
        { label: '🛍 다른 상품 보기', action: 'message', messageText: '상품 목록' },
        { label: '📦 배송 안내', action: 'message', messageText: '배송 안내' },
        { label: '❓ 자주 묻는 질문', action: 'message', messageText: '자주 묻는 질문' }
      ]
    }
  };
}

function buildPurchaseForm(utterance) {
  const is37 = utterance.includes('인도어') || utterance.includes('소고기') || utterance.includes('체중');
  const p = is37 ? PRODUCTS[37] : PRODUCTS[38];
  const other = is37 ? PRODUCTS[38] : PRODUCTS[37];

  return {
    version: '2.0',
    template: {
      outputs: [
        {
          basicCard: {
            title: `🛒 구매 신청 - ${p.shortName}`,
            description: `💰 ${p.price.toLocaleString()}원 · 무료배송\n\n아래 양식을 복사해서\n내용을 채워 전송해 주세요 😊\n\n─────────────────\n📋 구매 신청서\n\n구매 품목 : ${p.shortName}\n구매 수량 : (예: 1개)\n주소지 : \n연락처 : \n성함 : \n배송 메모 : \n─────────────────\n\n✅ 전송 후 담당자 확인 및\n결제 안내 드리겠습니다!`,
            thumbnail: { imageUrl: p.imageUrl, fixedRatio: true },
            buttons: [
              { label: '상품 페이지 보기', action: 'webLink', webLinkUrl: p.pageUrl }
            ]
          }
        }
      ],
      quickReplies: [
        { label: `🔄 ${other.shortName}`, action: 'message', messageText: `${other.shortName} 구매하기` },
        { label: '📦 배송 안내', action: 'message', messageText: '배송 안내' },
        { label: '🛍 상품 목록', action: 'message', messageText: '상품 목록' }
      ]
    }
  };
}

function buildPurchaseConfirm(utterance) {
  return {
    version: '2.0',
    template: {
      outputs: [
        {
          simpleText: {
            text: `✅ 구매 신청이 접수되었습니다!\n\n${utterance}\n\n─────────────────\n담당자 확인 후 결제 안내 드리겠습니다.\n영업일 기준 1~2시간 내 연락드립니다 😊\n\n📞 010-3223-1606\n📧 cndjrms29@naver.com`
          }
        }
      ],
      quickReplies: MAIN_QR
    }
  };
}

function buildShipping() {
  return {
    version: '2.0',
    template: {
      outputs: [
        {
          listCard: {
            header: { title: '📦 배송 안내' },
            items: [
              {
                title: '배송비',
                description: '전 상품 무료배송 🎉'
              },
              {
                title: '배송 기간',
                description: '주문 확인 후 1~2 영업일 내 출고\n수령까지 3~7일 소요'
              },
              {
                title: '도서·산간 지역',
                description: '추가 배송비가 발생할 수 있습니다'
              },
              {
                title: '교환 · 환불',
                description: '수령 후 7일 이내 미개봉 상품\n반송비는 고객 부담'
              },
              {
                title: '배송 조회',
                description: '결제 완료 후 운송장 번호 안내드립니다'
              }
            ],
            buttons: [
              { label: '홈페이지 방문', action: 'webLink', webLinkUrl: 'https://xn--om2b15qn1d.com/' }
            ]
          }
        }
      ],
      quickReplies: [
        { label: '🛍 상품 목록', action: 'message', messageText: '상품 목록' },
        { label: '🛒 구매하기', action: 'message', messageText: '구매하기' },
        { label: '📞 문의하기', action: 'message', messageText: '문의하기' }
      ]
    }
  };
}

function buildBrand() {
  return {
    version: '2.0',
    template: {
      outputs: [
        {
          basicCard: {
            title: '🏷 SCHRAIN 슈레인',
            description: '"우리 아이가 먹는다는 마음으로\n정성껏 안전한 식품으로만 사용합니다"\n\n─────────────────\n🌾 그레인프리 (무곡물)\n🥩 순수 육류 원료 사용\n🔬 LID 단일 단백질 설계\n📏 소형 키블 8mm 이하\n💪 단백질 40%+\n\n─────────────────\n📍 울산광역시 남구 문수로 476\n    3층 301호\n📞 010-3223-1606\n📧 cndjrms29@naver.com',
            thumbnail: {
              imageUrl: PRODUCTS[37].imageUrl
            },
            buttons: [
              { label: '🌐 홈페이지 방문', action: 'webLink', webLinkUrl: 'https://xn--om2b15qn1d.com/' }
            ]
          }
        }
      ],
      quickReplies: [
        { label: '🛍 상품 목록', action: 'message', messageText: '상품 목록' },
        { label: '🐟 성분 안내', action: 'message', messageText: '성분 안내' },
        { label: '📦 배송 안내', action: 'message', messageText: '배송 안내' }
      ]
    }
  };
}

function buildIngredients() {
  return {
    version: '2.0',
    template: {
      outputs: [
        {
          listCard: {
            header: { title: '🥩 SCHRAIN 원료 & 성분 안내' },
            items: [
              {
                title: '그레인프리 (Grain-free)',
                description: '곡물 無 · 소화 부담 최소화'
              },
              {
                title: '순수 육류 원료',
                description: '육분(고기가루) 없이 통 고기 사용'
              },
              {
                title: 'LID 단일 단백질',
                description: '알러지 반응 최소화 설계'
              },
              {
                title: '인도어 소고기+체중관리',
                description: '소고기 베이스 · 콜드프레스 공법\n실내묘 체중 조절 특화'
              },
              {
                title: '입맛 까다로운 단백질 40%',
                description: '청어+감자 베이스\n기호성 극대화 고단백 설계'
              }
            ],
            buttons: [
              { label: '상품 상세 보기', action: 'webLink', webLinkUrl: 'https://xn--om2b15qn1d.com/' }
            ]
          }
        }
      ],
      quickReplies: [
        { label: '🛍 상품 목록', action: 'message', messageText: '상품 목록' },
        { label: '🍽 급여 방법', action: 'message', messageText: '급여 방법' },
        { label: '🛒 구매하기', action: 'message', messageText: '구매하기' }
      ]
    }
  };
}

function buildFeeding() {
  return {
    version: '2.0',
    template: {
      outputs: [
        {
          listCard: {
            header: { title: '🍽 급여 방법 안내' },
            items: [
              {
                title: '적정 급여량',
                description: '체중 1kg당 약 20~25g\n하루 2~3회 나눠서 급여 권장'
              },
              {
                title: '처음 바꿀 때 (전환기)',
                description: '기존 사료 70% + 슈레인 30%\n→ 일주일에 걸쳐 서서히 교체'
              },
              {
                title: '생후 2개월 이상',
                description: '전 연령 급여 가능\n소형 키블로 어린 고양이도 OK'
              },
              {
                title: '신선한 물 상시 제공',
                description: '건식사료는 충분한 수분 섭취가 중요합니다'
              },
              {
                title: '보관 방법',
                description: '직사광선·습기 피해 서늘한 곳 보관\n개봉 후 밀봉하여 보관'
              }
            ],
            buttons: [
              { label: '상품 페이지 보기', action: 'webLink', webLinkUrl: 'https://xn--om2b15qn1d.com/' }
            ]
          }
        }
      ],
      quickReplies: [
        { label: '🛒 구매하기', action: 'message', messageText: '구매하기' },
        { label: '🥩 성분 안내', action: 'message', messageText: '성분 안내' },
        { label: '❓ 자주 묻는 질문', action: 'message', messageText: '자주 묻는 질문' }
      ]
    }
  };
}

function buildFAQ() {
  return {
    version: '2.0',
    template: {
      outputs: [
        {
          listCard: {
            header: { title: '❓ 자주 묻는 질문' },
            items: [
              {
                title: '배송비가 있나요?',
                description: '전 상품 무료배송입니다 🎉'
              },
              {
                title: '배송은 얼마나 걸리나요?',
                description: '출고 후 3~7일 소요 (영업일 기준 1~2일 내 출고)'
              },
              {
                title: '어떤 고양이에게 맞나요?',
                description: '인도어: 실내묘 체중관리\n단백질 40%: 식욕 까다로운 고양이'
              },
              {
                title: '교환/환불은 어떻게 하나요?',
                description: '수령 후 7일 이내 미개봉 상품\n반송비는 고객 부담'
              },
              {
                title: '결제는 어떻게 하나요?',
                description: '구매 신청서 전송 후\n담당자가 결제 링크 안내드립니다'
              },
              {
                title: '새끼 고양이도 먹을 수 있나요?',
                description: '생후 2개월 이상이면 급여 가능합니다'
              }
            ],
            buttons: [
              { label: '홈페이지 방문', action: 'webLink', webLinkUrl: 'https://xn--om2b15qn1d.com/' }
            ]
          }
        }
      ],
      quickReplies: [
        { label: '🛍 상품 목록', action: 'message', messageText: '상품 목록' },
        { label: '🛒 구매하기', action: 'message', messageText: '구매하기' },
        { label: '📞 문의하기', action: 'message', messageText: '문의하기' }
      ]
    }
  };
}

function buildContact() {
  return {
    version: '2.0',
    template: {
      outputs: [
        {
          basicCard: {
            title: '📞 문의하기',
            description: '궁금하신 점은 아래로 연락 주세요!\n\n📞 전화: 010-3223-1606\n📧 이메일: cndjrms29@naver.com\n\n⏰ 운영시간\n평일 09:00 ~ 18:00\n(주말·공휴일 휴무)\n\n📍 울산광역시 남구 문수로 476\n    3층 301호',
            thumbnail: {
              imageUrl: PRODUCTS[38].imageUrl
            },
            buttons: [
              { label: '📞 전화 문의', action: 'phone', phoneNumber: '010-3223-1606' },
              { label: '🌐 홈페이지 방문', action: 'webLink', webLinkUrl: 'https://xn--om2b15qn1d.com/' }
            ]
          }
        }
      ],
      quickReplies: [
        { label: '🛍 상품 목록', action: 'message', messageText: '상품 목록' },
        { label: '❓ 자주 묻는 질문', action: 'message', messageText: '자주 묻는 질문' }
      ]
    }
  };
}

// ─── 라우팅 함수 ──────────────────────────────────────────────────────────────
function route(utterance) {
  const u = utterance.trim();

  // 구매 신청서 접수 (양식 입력한 경우)
  if (/구매 품목/.test(u)) return buildPurchaseConfirm(u);

  // 특정 상품 구매
  if (/인도어.*구매|구매.*인도어|소고기.*구매|구매.*소고기|체중.*구매|구매.*체중/.test(u))
    return buildPurchaseForm('인도어');
  if (/까다로운.*구매|구매.*까다로운|단백질.*구매|구매.*단백질|청어.*구매|구매.*청어/.test(u))
    return buildPurchaseForm('까다로운');

  // 상품 상세
  if (/인도어|소고기|체중관리/.test(u)) return buildProductDetail(37);
  if (/까다로운|단백질 40|청어/.test(u)) return buildProductDetail(38);

  // 카테고리
  if (/상품|사료|목록|리스트|제품|뭐 파/.test(u)) return buildProductList();
  if (/구매|주문|사고싶|살게|구입/.test(u)) return buildPurchaseForm('까다로운');
  if (/배송|택배|언제|얼마나|도착|운송|교환|환불|반품/.test(u)) return buildShipping();
  if (/브랜드|회사|소개|슈레인|schrain|어떤 곳/.test(u)) return buildBrand();
  if (/성분|원료|재료|그레인|단백질|lid/.test(u)) return buildIngredients();
  if (/급여|먹이|어떻게 먹|얼마나 먹|밥/.test(u)) return buildFeeding();
  if (/faq|자주|질문|궁금|모르겠|어떻게/.test(u)) return buildFAQ();
  if (/문의|연락|전화|이메일|카톡|연락처/.test(u)) return buildContact();

  return null;
}

// ─── 엔드포인트 ───────────────────────────────────────────────────────────────

app.post('/welcome', (req, res) => res.json(buildWelcome()));

app.post('/fallback', (req, res) => res.json(buildFallback()));

app.post('/products', (req, res) => res.json(buildProductList()));

app.post('/shipping', (req, res) => res.json(buildShipping()));

app.post('/brand', (req, res) => res.json(buildBrand()));

app.post('/faq', (req, res) => res.json(buildFAQ()));

app.post('/contact', (req, res) => res.json(buildContact()));

app.post('/ingredients', (req, res) => res.json(buildIngredients()));

app.post('/feeding', (req, res) => res.json(buildFeeding()));

app.post('/purchase', (req, res) => {
  const utterance = req.body?.userRequest?.utterance || '';
  res.json(buildPurchaseForm(utterance));
});

app.post('/purchase/confirm', (req, res) => {
  const utterance = req.body?.userRequest?.utterance || '';
  res.json(buildPurchaseConfirm(utterance));
});

// 통합 스킬 (utterance 자동 분기)
app.post('/skill', (req, res) => {
  const utterance = req.body?.userRequest?.utterance || '';
  const result = route(utterance);
  res.json(result || buildFallback());
});

// ─── 서버 시작 ────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`SCHRAIN 카카오 챗봇 스킬 서버 → http://localhost:${PORT}`);
  console.log('엔드포인트: /welcome /fallback /skill /products /purchase /shipping /brand /faq /contact /ingredients /feeding');
});
