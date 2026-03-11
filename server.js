const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const PRODUCTS = {
  37: {
    name: '슈레인 인도어 소고기+체중관리 2.5kg',
    shortName: '인도어 소고기+체중관리',
    price: 27000,
    description: '실내 고양이를 위한 그레인프리 건식사료\n✔ 단백질 40%+ 순수 육류 원료\n✔ 소형 키블 8mm 이하\n✔ 체중관리 특화 포뮬러',
    imageUrl: 'https://ecimg.cafe24img.com/pg2547b04207977059/cndjrms30/web/product/big/20260129/fde42501677263b549c05d016fd3c5ac.jpg',
    pageUrl: 'https://xn--om2b15qn1d.com/product/detail.html?product_no=37&cate_no=1&display_group=2'
  },
  38: {
    name: '슈레인 입맛 까다로운 단백질 40%',
    shortName: '입맛 까다로운 단백질 40%',
    price: 20000,
    description: '까다로운 고양이를 위한 그레인프리 건식사료\n✔ 단백질 40% 청어&감자 베이스\n✔ 소형 키블 8mm 이하\n✔ 생후 2개월 이상 전 연령',
    imageUrl: 'https://ecimg.cafe24img.com/pg2547b04207977059/cndjrms30/web/product/big/20260129/4f39030fd759620da2b84d8227b7914b.jpg',
    pageUrl: 'https://xn--om2b15qn1d.com/product/detail.html?product_no=38&cate_no=1&display_group=2'
  }
};

// 상품 목록 카드 생성
function buildProductCarousel() {
  return {
    version: '2.0',
    template: {
      outputs: [
        {
          simpleText: {
            text: '🐱 슈레인 고양이 사료\n아래 상품 중 선택해 주세요!'
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
              thumbnails: [
                {
                  imageUrl: p.imageUrl,
                  link: { web: p.pageUrl }
                }
              ],
              profile: {
                nickname: '슈레인'
              },
              buttons: [
                {
                  label: '상세보기',
                  action: 'webLink',
                  webLinkUrl: p.pageUrl
                },
                {
                  label: '구매하기',
                  action: 'message',
                  messageText: `${p.shortName} 구매하기`
                }
              ]
            }))
          }
        }
      ],
      quickReplies: [
        { label: '📦 구매 방법 안내', action: 'message', messageText: '구매 방법 안내' },
        { label: '🛍 전체 상품 보기', action: 'message', messageText: '상품 목록' }
      ]
    }
  };
}

// 구매 안내 응답
function buildPurchaseGuide(productName) {
  const isProduct37 = productName && productName.includes('인도어');
  const product = isProduct37 ? PRODUCTS[37] : PRODUCTS[38];

  return {
    version: '2.0',
    template: {
      outputs: [
        {
          basicCard: {
            title: '🛒 구매 신청 안내',
            description: `아래 양식을 그대로 복사해서\n내용을 채워 전송해 주세요 😊\n\n─────────────────\n📋 구매 신청서\n\n구매 품목 : ${product.shortName}\n구매 수량 : (숫자 입력)\n주소지 : \n연락처 : \n성함 : \n배송 메모 : \n─────────────────\n\n입력 후 전송하시면 확인 후\n결제 안내 드리겠습니다! 💳`,
            thumbnail: {
              imageUrl: product.imageUrl
            },
            buttons: [
              {
                label: '상품 페이지 보기',
                action: 'webLink',
                webLinkUrl: product.pageUrl
              }
            ]
          }
        }
      ],
      quickReplies: [
        { label: '🐱 다른 상품 보기', action: 'message', messageText: '상품 목록' },
        { label: '❓ 자주 묻는 질문', action: 'message', messageText: '자주 묻는 질문' }
      ]
    }
  };
}

// 구매 접수 확인 응답 (사용자가 양식 입력 후)
function buildPurchaseConfirm(utterance) {
  return {
    version: '2.0',
    template: {
      outputs: [
        {
          simpleText: {
            text: `✅ 구매 신청이 접수되었습니다!\n\n아래 내용으로 확인 도와드리겠습니다:\n\n${utterance}\n\n─────────────────\n📞 확인 후 결제 안내 드리겠습니다.\n보통 영업일 기준 1-2시간 내 연락 드립니다 😊`
          }
        }
      ],
      quickReplies: [
        { label: '🛍 상품 목록 보기', action: 'message', messageText: '상품 목록' },
        { label: '❓ 자주 묻는 질문', action: 'message', messageText: '자주 묻는 질문' }
      ]
    }
  };
}

// 자주 묻는 질문
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
                title: '배송은 얼마나 걸리나요?',
                description: '주문 확인 후 1-2 영업일 내 출고, 도착까지 2-3일 소요됩니다.',
                imageUrl: 'https://ecimg.cafe24img.com/pg2547b04207977059/cndjrms30/web/product/big/20260129/fde42501677263b549c05d016fd3c5ac.jpg'
              },
              {
                title: '배송비는 얼마인가요?',
                description: '3만원 이상 무료배송, 미만 시 배송비가 부과됩니다.'
              },
              {
                title: '어떤 고양이에게 맞나요?',
                description: '인도어용은 실내묘 체중관리, 단백질40%는 식욕 까다로운 고양이에게 추천합니다.'
              },
              {
                title: '교환/환불은 어떻게 하나요?',
                description: '수령 후 7일 이내 미개봉 상품에 한해 교환/환불 가능합니다.'
              }
            ],
            buttons: [
              {
                label: '홈페이지 방문',
                action: 'webLink',
                webLinkUrl: 'https://xn--om2b15qn1d.com/'
              }
            ]
          }
        }
      ],
      quickReplies: [
        { label: '🛍 상품 목록 보기', action: 'message', messageText: '상품 목록' },
        { label: '🛒 구매하기', action: 'message', messageText: '구매하기' }
      ]
    }
  };
}

// 웰컴 메시지
function buildWelcome() {
  return {
    version: '2.0',
    template: {
      outputs: [
        {
          simpleText: {
            text: '안녕하세요! 🐱\n슈레인 고양이 사료 공식 채널입니다.\n\n아래 메뉴에서 원하시는 항목을 선택해 주세요 😊'
          }
        }
      ],
      quickReplies: [
        { label: '🛍 상품 목록', action: 'message', messageText: '상품 목록' },
        { label: '🛒 구매하기', action: 'message', messageText: '구매하기' },
        { label: '❓ 자주 묻는 질문', action: 'message', messageText: '자주 묻는 질문' }
      ]
    }
  };
}

// ─── 라우트 ──────────────────────────────────────────

// 웰컴 블록
app.post('/welcome', (req, res) => {
  res.json(buildWelcome());
});

// 상품 목록
app.post('/products', (req, res) => {
  res.json(buildProductCarousel());
});

// 구매 안내 (특정 상품 또는 일반)
app.post('/purchase', (req, res) => {
  const utterance = req.body?.userRequest?.utterance || '';
  res.json(buildPurchaseGuide(utterance));
});

// 구매 접수 확인 (사용자가 양식 채워서 전송)
app.post('/purchase/confirm', (req, res) => {
  const utterance = req.body?.userRequest?.utterance || '';
  res.json(buildPurchaseConfirm(utterance));
});

// FAQ
app.post('/faq', (req, res) => {
  res.json(buildFAQ());
});

// 통합 라우트 (utterance 기반 자동 분기)
app.post('/skill', (req, res) => {
  const utterance = (req.body?.userRequest?.utterance || '').trim();

  if (/상품|사료|목록|리스트/.test(utterance)) {
    return res.json(buildProductCarousel());
  }
  if (/인도어.*구매|구매.*인도어/.test(utterance)) {
    return res.json(buildPurchaseGuide('인도어 소고기+체중관리'));
  }
  if (/까다로운.*구매|구매.*까다로운|단백질.*구매|구매.*단백질/.test(utterance)) {
    return res.json(buildPurchaseGuide('입맛 까다로운'));
  }
  if (/구매 품목/.test(utterance)) {
    // 구매 양식 입력된 경우
    return res.json(buildPurchaseConfirm(utterance));
  }
  if (/구매/.test(utterance)) {
    return res.json(buildPurchaseGuide(''));
  }
  if (/faq|질문|배송|교환|환불/.test(utterance)) {
    return res.json(buildFAQ());
  }

  // 기본: 상품 목록
  return res.json(buildProductCarousel());
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`슈레인 카카오 챗봇 스킬 서버 실행 중 → http://localhost:${PORT}`);
  console.log('엔드포인트:');
  console.log(`  POST /welcome       - 웰컴 블록`);
  console.log(`  POST /products      - 상품 목록`);
  console.log(`  POST /purchase      - 구매 안내`);
  console.log(`  POST /purchase/confirm - 구매 접수 확인`);
  console.log(`  POST /faq           - 자주 묻는 질문`);
  console.log(`  POST /skill         - 통합 (utterance 자동 분기)`);
});
