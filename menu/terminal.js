const bootText = `
MWI-PROTOCOL BASE SYSTEM CORE TERMINAL
VERSION 2.1 - PASTCORE

SYSTEM STATUS : NORMAL
USER CONNECTED : ADRIFT02
PERMISSION CHECK : ACCESS VERIFIED
FINAL TERMINAL STATUS : ???

ACCESS ERA : ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
LOG RETRIEVAL FAILED.
UNAUTHORIZED PRESENCE DETECTED FAILED.
SERVER SECURITY INITIALIZATION IN PROGRESS...
`;

  const outputElem = document.getElementById('terminal-output');
  const inputLine = document.getElementById('input-line');
  const userInput = document.getElementById('user-input');
  const cursor = document.getElementById('custom-cursor');
  const terminalContainer = document.getElementById('terminal-container');

  let index = 0;
  let isAsking = false;
  let handleAnswer = null;

  function typeBootText() {
    if (index < bootText.length) {
      outputElem.textContent += bootText.charAt(index);
      index++;
      terminalContainer.scrollTop = terminalContainer.scrollHeight;
      setTimeout(typeBootText, 3);
    } else {
      inputLine.style.display = 'flex';
      userInput.focus();
      startSequence();
    }
  }

  userInput.addEventListener("input", () => {
    moveCursorToEnd();
  });

  userInput.addEventListener("click", () => {
    moveCursorToEnd();
  });

  function moveCursorToEnd() {
    const range = document.createRange();
    const sel = window.getSelection();
    range.selectNodeContents(userInput);
    range.collapse(false);
    sel.removeAllRanges();
    sel.addRange(range);
  }

  function globalKeyHandler(e) {
    if (e.key.length === 1 || e.key === 'Backspace') {
      userInput.focus();
    }
  }

  setInterval(() => {
    userInput.focus();
  }, 300);

function terminalPrint(text) {
  outputElem.innerHTML += "<br>" + text.replace(/\n/g, "<br>");
  terminalContainer.scrollTop = terminalContainer.scrollHeight;
}

  function askQuestion() {
    const q = questions[currentQuestionIndex];
    terminalPrint(q.text);
    isAsking = true;
  }

  typeBootText();

  function startSequence() {
  terminalPrint("[INFO] SYSTEM ONLINE. TYPE 'help' FOR COMMANDS. \n");
}

  //-------------------설문 시퀀스-----------------------

  // 명령어 처리 스크립트
const commands = {
  usc: startUSC,
  exit: () => window.location.href = "menu.html",
  help: () => {
    terminalPrint(`\n사용 가능한 명령어:
- usc       : 사용자 설문 시스템 실행
- exit      : 메뉴로 나가기
- help      : 명령어 목록 보기
- check     : 시스템 상태 점검
- logs      : 로그 없음
- cd        : 권한 없음
- psx       : 현재 프로토콜 정보 출력
- ipconfig  : 인터넷 설정 확인
- ifconfig  : 인터넷 설정 확인
- ctl       : 장비 상태 출력
- re        : 시스템 재시작`);
  },
  check: () => terminalPrint("\n[STATUS] All systems nominal. Protocol sync: OK. Security patch: Updated.\n"),
  logs: () => terminalPrint("\n[LOGS] No retrievable log found. Archive corrupted.\n"),
  cd: () => terminalPrint("\n[ERROR] Permission denied.\n"),
  psx: () => terminalPrint("\n[PROTOCOL] MWI-Core v2.1 | Auth: root | Env: FutureShell\n"),
  ipconfig: () => terminalPrint("\n[NET] IP: 228.09.33.56 / IPv6: ::MWI:2087 | Gateway: qnexus.net\n"),
  ifconfig: () => terminalPrint("\n[NET] IP: 228.09.33.56 / IPv6: ::MWI:2087 | Gateway: qnexus.net\n"),
  ctl: () => terminalPrint("\n[DEVICE] Adrift MK-IV Headgear / SecureDrive Attached / Sensor Grid: Enabled\n"),
re: () => {
  terminalPrint("\n[SYS] Restarting terminal...");
  inputLine.style.display = 'none';

  setTimeout(() => {
    outputElem.innerText = "";

    // 🔽 여기에 암전 오버레이 생성
    const overlay = document.createElement("div");
    overlay.style.position = "absolute";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "black";
    overlay.style.zIndex = "9999";
    overlay.id = "blackout";
    document.body.appendChild(overlay);

    // 부트 연출 전 2초 후 오버레이 제거
    setTimeout(() => {
      const overlay = document.getElementById("blackout");
      if (overlay) overlay.remove();
      index = 0;
      typeBootText();
    }, 1000);
  }, 1000);
}
}

function setInputEditable(editable) {
  if (editable) {
    userInput.setAttribute("contenteditable", "true");
    userInput.style.pointerEvents = "auto";
    userInput.focus();
  } else {
    userInput.setAttribute("contenteditable", "false");
    userInput.style.pointerEvents = "none";
  }
}

// 기본 명령어 처리
function processCommand(input) {
  const cmd = input.toLowerCase();
  if (commands[cmd]) {
    commands[cmd]();
  } else {
    terminalPrint("\n[UNKNOWN COMMAND] Type 'help' to see available commands.");
  }
}

// USC 설문 시스템
function startUSC() {
  const uscQuestions = [
    { text: "[USC-00] User Self Check 시스템\n멀티팩터 인증을 통한 사용자 자가 점검 및 문답\n(Enter)", choices: ["enter"] },
    { text: "[USC-01] 사용자 확인\n(Enter)", choices: ["enter"] },
    { text: "[USC-02] 프로세스 정상 작동 중인지 확인\n(Enter)", choices: ["enter"] },
    { text: "[USC-03] secure os 가동 중인지 확인\n(Enter)", choices: ["enter"] },
    { text: "[USC-04] 시간에 대한 정보 수집 동의\nY / 동일\nN / 동일", choices: ["y", "n"] },
    { text: "[USC-05] 상태 점검에 대한 정보 수집 동의\nY / 동일\nN / 동일", choices: ["y", "n"] },
    { text: "[USC-06] 사용자 자가 점검 시작 할건지?\nY / 시작 (다음 설문으로 넘어감)\nN / 초기화(re와 동일)", choices: ["y", "n"] },
  ];

  let qIndex = 0;

  function askNextUSC() {
    if (qIndex < uscQuestions.length) {
      terminalPrint("\n" + uscQuestions[qIndex].text);
      isAsking = true;
    } else {
      terminalPrint("\n[USC] 설문 완료. 다음 프로세스로 이동합니다.");
      isAsking = false;
      handleAnswer = null;
    }
  }

  // 🔧 handleAnswer를 전역 변수에 연결!
  handleAnswer = function (input) {
    const answer = input.toLowerCase();
    const current = uscQuestions[qIndex];

    if (
      current.choices.includes(answer) ||
      (answer === "" && current.choices.includes("enter"))
    ) {
      if (qIndex === 6 && answer === "n") {
  commands.re();
  return;
}
if (qIndex === 6 && answer === "y") {
  outputElem.innerHTML = ""; // 출력 초기화
  terminalPrint("[USC] 자가 점검 모드 진입...");
  setTimeout(() => {
    outputElem.innerHTML = "";
    startSecondSurvey(); // 👉 두 번째 설문 시작
  }, 1500);
  return;
      }
      qIndex++;
      askNextUSC();
    } else {
      terminalPrint("\n[입력 오류] 올바른 선택지를 입력해주세요.");
      isAsking = true;
    }
  };

  askNextUSC(); // 첫 질문 출력
}

userInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
    const input = userInput.innerText.replace(/\n/g, '').trim();

    // 출력은 항상 한다
    outputElem.innerHTML += `<br>Adrift01 &gt; ${input}`;
    userInput.innerHTML = "";
    terminalContainer.scrollTop = terminalContainer.scrollHeight;

    // ✅ 설문 중이면 공백도 handleAnswer로 넘긴다
    if (isAsking) {
      isAsking = false;
      handleAnswer(input);
    } else {
      // ✅ 일반 명령어에서만 공백 차단
      if (input.length === 0) return;
      processCommand(input);
    }
  }
});


//--------------두번째 설문------------------

function typeTextAnimated(text, callback) {
  outputElem.innerHTML = ""; // 출력 초기화
  let i = 0;
  function typeChar() {
    if (i < text.length) {
      outputElem.innerHTML += text.charAt(i) === "\n" ? "<br>" : text.charAt(i);
      i++;
      terminalContainer.scrollTop = terminalContainer.scrollHeight;
      setTimeout(typeChar, 15); // 속도 조절 가능 (ms)
    } else {
      if (callback) callback();
    }
  }
  typeChar();
}
function startSecondSurvey() {
  const surveyQuestions = [
    {
      text: "[Q7] 현재 자신의 의지로 Pastcore를 이용하고 있는지? (Y/N)",
      choices: ["y", "n"]
    },
    {
      text: "[Q8] 현재 이 문장을 읽고 있다면, 가독성이 어떤지 (1/2/3)\n1/ 좋다\n2/ 나쁘다\n3/ Unknown Access",
      choices: ["1", "2", "3"]
    },
    {
      text: "[Q9] 현재 프로토콜 수신이 올바르다 생각하는지 (Y/N)",
      choices: ["y", "n"]
    },
    {
      text: "[Q10] 시간은 선형적이라고 생각하는지 (Y/N)",
      choices: ["y", "n"]
    },
    {
      text: "[Q11] 과거에 접속하는 것이 어떤 형태였으면 좋겠는지 (1/2/3)\n1/ 현재에서 과거로 전환\n2/ 과거의 데이터를 통한 시뮬레이트\n3/ 자체 생성",
      choices: ["1", "2", "3"]
    }
  ];

  let surveyIndex = 0;

  function showSurveyQuestion() {
    outputElem.innerHTML = ""; // 출력 초기화
    const q = surveyQuestions[surveyIndex];
    isAsking = false;
    setInputEditable(false);
    typeTextAnimated(q.text, () => {
      isAsking = true;
      setInputEditable(true);
    });
  }

  handleAnswer = function(input) {
    const answer = input.toLowerCase();
    const current = surveyQuestions[surveyIndex];

    if (current.choices.includes(answer)) {
      isAsking = false;
      setTimeout(() => {
        surveyIndex++;
        if (surveyIndex < surveyQuestions.length) {
  showSurveyQuestion();
} else {
  outputElem.innerHTML = "";
  setInputEditable(false);
typeTextAnimated("[SURVEY COMPLETE] 모든 질문이 완료되었습니다.", () => {
      setInputEditable(true);
  setTimeout(() => {
    startThirdSurvey();
  }, 3000); // 3초 딜레이 후 3번째 설문 시작
});
}
      }, 2000);
    } else {
      terminalPrint("\n[입력 오류] 올바른 선택지를 입력해주세요.");
      isAsking = true;
    }
  };

  showSurveyQuestion();
}

//-----------------3번째 설문------------------------

function startThirdSurvey() {
  const thirdSurveyQuestions = [
    { text: "[Q12] 자신이라는 개념이 하나의 존재로 규정되는지? (Y/N)", choices: ["y", "n"] },
    { text: "[Q13] 자신을 인식하는 주체와 대상을 구분할 수 있는지? (Y/N)", choices: ["y", "n"] },
    { text: "[Q14] 자신이라는 개체를 시뮬레이션 중 하나라고 생각한 적 있는지? (Y/N)", choices: ["y", "n"] },
    { text: "[Q15] 누군가 자신을 쳐다보고 있는지? (Y/N)", choices: ["y", "n"] },
    { 
      text: "[Q16] 현재 자신의 상태에 대해? (1/2/3)\n1/ 정상접근\n2/ 알 수 없다\n3/ 미승인접근", 
      choices: ["1", "2", "3"] 
    },
  ];

  let qIndex = 0;

  // '프로토콜 핵심 지능 규정 완료' 출력 후 설문 시작
      setInputEditable(false);
  typeTextAnimated("[INFO] 프로토콜 핵심 지능 규정 완료.\n\n", () => {
      setInputEditable(true);
      setTimeout(() => {
    showNextQuestion();
     }, 3000);
  });

  function showNextQuestion() {
    if (qIndex < thirdSurveyQuestions.length) {
      isAsking = false;
    setInputEditable(false);
      typeTextAnimated(thirdSurveyQuestions[qIndex].text, () => {
        isAsking = true;
      setInputEditable(true);
      });
    } else {
      outputElem.innerHTML = "";
      setInputEditable(false);
typeTextAnimated("[SURVEY COMPLETE] 모든 질문이 완료되었습니다.", () => {
      setInputEditable(true);
  setTimeout(() => {
    startFourthSurvey();
  }, 3000); // 3초 딜레이 후 3번째 설문 시작
});
    }
  }

  handleAnswer = function(input) {
    const answer = input.toLowerCase();
    const current = thirdSurveyQuestions[qIndex];

    if (current.choices.includes(answer)) {
      isAsking = false;
      qIndex++;
      setTimeout(() => {
        showNextQuestion();
      }, 2000);
    } else {
      terminalPrint("\n[입력 오류] 올바른 선택지를 입력해주세요.");
      isAsking = true;
    }
  };
}
//-----------------4번째 설문-------------------
function startFourthSurvey() {
  const fourthSurveyQuestions = [
    { 
      text: "[Q17] 현재 세션이 미래로 뜨는데, 서브넷이 온전한가 (1/2/3)\n1/ 온전하다\n2/ 안 온전하다\n3/ 알 수 없다", 
      choices: ["1", "2", "3"] 
    },
    { text: "[Q18] 인류는 번영하였는가 (Y/N)", choices: ["y", "n"] },
    { text: "[Q19] 위협이 되는 요소가 근처에 있는가 (Y/N)", choices: ["y", "n"] },
    { text: "[Q20] 인류는 차원을 넘었는가 (Y/N)", choices: ["y", "n"] },
    { 
      text: "[Q21] 혼자 남았는가 (1/2/3)\n1/ 그렇다\n2/ 아니다\n3/ 알 수 없다", 
      choices: ["1", "2", "3"] 
    },
  ];

  let qIndex = 0;

  // 설문 시작 메시지 출력 후 질문 시작
      setInputEditable(false);
  typeTextAnimated("[INFO] 정상 개체 확인 완료. 정보 설문 출력하겠습니다.\n\n", () => {
      setInputEditable(true);
    setTimeout(() => {
      showNextQuestion();
    }, 3000);
  });

  function showNextQuestion() {
    if (qIndex < fourthSurveyQuestions.length) {
      isAsking = false;
    setInputEditable(false);
      typeTextAnimated(fourthSurveyQuestions[qIndex].text, () => {
        isAsking = true;
      setInputEditable(true);
      });
    } else {
      outputElem.innerHTML = "";
      setInputEditable(false);
typeTextAnimated("[SURVEY COMPLETE] 모든 질문이 완료되었습니다.", () => {
      setInputEditable(true);
  setTimeout(() => {
    startFifthSurvey();
  }, 3000); // 3초 딜레이 후 3번째 설문 시작
});
    }
  }

  handleAnswer = function(input) {
    const answer = input.toLowerCase();
    const current = fourthSurveyQuestions[qIndex];

    if (current.choices.includes(answer)) {
      isAsking = false;
      qIndex++;
      setTimeout(() => {
        showNextQuestion();
      }, 2000);
    } else {
      terminalPrint("\n[입력 오류] 올바른 선택지를 입력해주세요.");
      isAsking = true;
    }
  };
}
//--------------5번째 설문----------------
function startFifthSurvey() {
  const fifthSurveyQuestions = [
    { text: "[Q22] 위협적인 존재가 고차원의 존재인가 (Y/N)", choices: ["y", "n"] },
    { text: "[Q23] 인류의 멸종 계기는 그 존재 때문인가 (Y/N)", choices: ["y", "n"] },
    { text: "[Q24] 다른 인류를 본 적 있는가 (Y/N)", choices: ["y", "n"] },
  ];

  let qIndex = 0;

  // 시작 메시지 출력 후 설문 시작
      setInputEditable(false);
  typeTextAnimated("[INFO] 동 시간대 다른 세션 접속 여부 없음 확인. 인류 멸종 확인 정보설문 출력하겠습니다.\n\n", () => {
      setInputEditable(true);
    setTimeout(() => {
      showNextQuestion();
    }, 3000);
  });

  function showNextQuestion() {
    if (qIndex < fifthSurveyQuestions.length) {
      isAsking = false;
    setInputEditable(false);
      typeTextAnimated(fifthSurveyQuestions[qIndex].text, () => {
        isAsking = true;
      setInputEditable(true);
      });
    } else {
      outputElem.innerHTML = "";
      setInputEditable(false);
typeTextAnimated("[SURVEY COMPLETE] 모든 질문이 완료되었습니다.", () => {
      setInputEditable(true);
  setTimeout(() => {
    startSixthSurvey();
  }, 3000); // 3초 딜레이 후 3번째 설문 시작
});
    }
  }

  handleAnswer = function(input) {
    const answer = input.toLowerCase();
    const current = fifthSurveyQuestions[qIndex];

    if (current.choices.includes(answer)) {
      isAsking = false;
      qIndex++;
      setTimeout(() => {
        showNextQuestion();
      }, 2000);
    } else {
      terminalPrint("\n[입력 오류] 올바른 선택지를 입력해주세요.");
      isAsking = true;
    }
  };
}

//-----------------6번째 설문-----------------------
function startSixthSurvey() {
  const sixthSurveyQuestions = [
    { 
      text: "[Q25] 디지털 정보로써 존재하는 자아체인가? (1/2/3)\n1/ 그렇다\n2/ 아니다\n3/ 알 수 없다", 
      choices: ["1", "2", "3"] 
    },
    { text: "[Q26] 사이버 상에 존재하게 된 이유가 미증유의 위협적 존재 때문인가? (Y/N)", choices: ["y", "n"] },
    { text: "[Q27] 데이터가 아닌 물리적 존재로 돌아갈 수 있나? (Y/N)", choices: ["y", "n"] },
  ];

  let qIndex = 0;

  // ‘. . . . .’ 출력 후 3초 딜레이, 사이버 휴먼 모듈 가동 메시지 출력 -> 설문 시작
  setInputEditable(false);
  typeTextAnimated(". . . . .\n\n", () => {
    setInputEditable(true);
    setTimeout(() => {
      setInputEditable(false);
      typeTextAnimated("[INFO] 사이버 휴먼 모듈 가동.\n\n", () => {
        setInputEditable(true);
        setTimeout(() => {
          showNextQuestion();
        }, 1000);
      });
    }, 3000);
  });

  function showNextQuestion() {
    if (qIndex < sixthSurveyQuestions.length) {
      isAsking = false;
    setInputEditable(false);
      typeTextAnimated(sixthSurveyQuestions[qIndex].text, () => {
        isAsking = true;
      setInputEditable(true);
      });
    } else {
      outputElem.innerHTML = "";
      setInputEditable(false);
typeTextAnimated("[SURVEY COMPLETE] 모든 질문이 완료되었습니다.", () => {
      setInputEditable(true);
  setTimeout(() => {
    startSeventhSurvey();
  }, 3000); // 3초 딜레이 후 다음 설문 시작
});
    }
  }

  handleAnswer = function(input) {
    const answer = input.toLowerCase();
    const current = sixthSurveyQuestions[qIndex];

    if (current.choices.includes(answer)) {
      isAsking = false;
      qIndex++;
      setTimeout(() => {
        showNextQuestion();
      }, 2000);
    } else {
      terminalPrint("\n[입력 오류] 올바른 선택지를 입력해주세요.");
      isAsking = true;
    }
  };
}
//-------------7번째 설문--------------
function startSeventhSurvey() {
  const seventhSurveyQuestions = [
    { 
      text: "[Q28] 현재 관찰 시퀀스를 가동 하려 합니다 동의 하십니까? (Y/N)\nY/ 동일\nN/ 동일", 
      choices: ["y", "n"] 
    }
  ];

  let qIndex = 0;

  setInputEditable(false);
  typeTextAnimated(". . . . .\n\n", () => {
    setInputEditable(true);
    setTimeout(() => {
      setInputEditable(false);
      typeTextAnimated("[INFO] 관찰 기동.\n\n", () => {
        setInputEditable(true);
        setTimeout(() => {
          showNextQuestion();
        }, 1000);
      });
    }, 3000);
  });

  function showNextQuestion() {
    if (qIndex < seventhSurveyQuestions.length) {
      isAsking = false;
    setInputEditable(false);
      typeTextAnimated(seventhSurveyQuestions[qIndex].text, () => {
        isAsking = true;
      setInputEditable(true);
      });
    } else {
      // 질문 끝났으니 글리치 연출 시작
      glitchWholeTerminal(() => {
        // 1초 후 초기화 및 다음 메시지 출력
        setTimeout(() => {
          restoreTerminalAfterGlitch(() => {
            showFinalMessageAndQuestion();
          });
        }, 1000);
      });
    }
  }

  handleAnswer = function(input) {
    const answer = input.toLowerCase();
    const current = seventhSurveyQuestions[qIndex];

    if (current.choices.includes(answer)) {
      if (qIndex === 0 && answer === "n") {
        terminalPrint("\n[INFO] 관찰 시퀀스를 가동하려면 동의가 필요합니다. 다시 답변해 주세요.");
        isAsking = true;
        return;
      }
      if (answer === "y") {
        // y 입력 시 바로 글리치 연출
        glitchWholeTerminal(() => {
          setTimeout(() => {
            restoreTerminalAfterGlitch(() => {
              showFinalMessageAndQuestion();
            });
          }, 1000);
        });
        return;
      }
      isAsking = false;
      qIndex++;
      setTimeout(() => {
        showNextQuestion();
      }, 2000);
    } else {
      terminalPrint("\n[입력 오류] 이건 또 흥미로운 세계를 발견했구만. 자네 덕에 데이터가 늘고있네.");
      isAsking = true;
    }
  };
}




function glitchWholeTerminal(callback) {
  inputLine.style.display = 'none';
  document.body.style.overflow = 'hidden';
  document.documentElement.style.overflow = 'hidden';

  const rect = terminalContainer.getBoundingClientRect();

  const glitchContainer = document.createElement('div');
  glitchContainer.id = 'glitch-container';
  glitchContainer.style.position = 'absolute';
  glitchContainer.style.top = `${rect.top + window.scrollY}px`;
  glitchContainer.style.left = `${rect.left + window.scrollX}px`;
  glitchContainer.style.width = `${rect.width}px`;
  glitchContainer.style.height = `${rect.height}px`;
  glitchContainer.style.overflow = 'visible';
  glitchContainer.style.pointerEvents = 'none';
  glitchContainer.style.zIndex = '9999';
  document.body.appendChild(glitchContainer);

  const rows = 6, cols = 12;
  const pieceWidth = rect.width / cols;
  const pieceHeight = rect.height / rows;

  const terminalClone = terminalContainer.cloneNode(true);
  terminalClone.id = 'terminal-clone';
  terminalClone.style.position = 'fixed';
  terminalClone.style.top = `${rect.top}px`;
  terminalClone.style.left = `${rect.left}px`;
  terminalClone.style.margin = '0';
  terminalClone.style.pointerEvents = 'none';
  terminalClone.style.userSelect = 'none';
  terminalClone.style.width = `${rect.width}px`;
  terminalClone.style.height = `${rect.height}px`;
  terminalClone.style.overflow = 'visible';
  terminalClone.style.zIndex = '10000';
  terminalClone.style.filter = 'grayscale(100%)';
  document.body.appendChild(terminalClone);

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const piece = document.createElement('div');
      piece.style.position = 'absolute';
      piece.style.width = `${pieceWidth}px`;
      piece.style.height = `${pieceHeight}px`;
      piece.style.overflow = 'hidden';
      piece.style.top = `${r * pieceHeight}px`;
      piece.style.left = `${c * pieceWidth}px`;
      piece.style.backgroundColor = 'black';

      const innerClone = terminalClone.cloneNode(true);
      innerClone.style.position = 'absolute';
      innerClone.style.top = `-${r * pieceHeight}px`;
      innerClone.style.left = `-${c * pieceWidth}px`;
      innerClone.style.width = `${rect.width}px`;
      innerClone.style.height = `${rect.height}px`;
      innerClone.style.pointerEvents = 'none';
      innerClone.style.userSelect = 'none';

      piece.appendChild(innerClone);
      glitchContainer.appendChild(piece);

      const offsetX = (Math.random() - 0.5) * rect.width * 0.8;
      const offsetY = (Math.random() - 0.5) * rect.height * 0.8;
      piece.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    }
  }

  terminalContainer.style.visibility = 'hidden';

  // ✅ 글리치 연출을 500ms 보여준 뒤 검은 화면 덮기
  setTimeout(() => {
    const blackOverlay = document.createElement('div');
    blackOverlay.id = 'black-overlay';
    blackOverlay.style.position = 'fixed';
    blackOverlay.style.top = '0';
    blackOverlay.style.left = '0';
    blackOverlay.style.width = '100vw';
    blackOverlay.style.height = '100vh';
    blackOverlay.style.backgroundColor = 'black';
    blackOverlay.style.zIndex = '11000';
    document.body.appendChild(blackOverlay);

    if (callback) callback();
  }, 1000); // 글리치 화면 보여주는 시간
}


function restoreTerminalAfterGlitch(callback) {
  const glitchContainer = document.getElementById('glitch-container');
  if (glitchContainer) glitchContainer.remove();

  const terminalClone = document.getElementById('terminal-clone');
  if (terminalClone) terminalClone.remove();

  // 검은 화면 이미 덮여 있으므로 3초 후 복원만 수행
  setTimeout(() => {
    const blackOverlay = document.getElementById('black-overlay');
    if (blackOverlay) blackOverlay.remove();

    terminalContainer.style.visibility = 'visible';
    inputLine.style.display = 'flex';
    userInput.focus();

    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';

    if (callback) callback();
  }, 3000);
}



function showFinalMessageAndQuestion() {
  outputElem.innerHTML = ""; // 초기화

  const finalMessageAndQuestion = `
【
기억 조정 완료.
시계열 조정 완료.
사용자 자가 점검 마침.

데이터 최적화 완료.
처리 완료.
관찰 시퀀스 종료.

감사합니다. 관찰이 완료되었고, 참여가 기록, 전송되었습니다.
】

[Q30] 터미널을 초기화 하시겠습니까? (Y)
Y/ 동일
`;
setInputEditable(false);
  typeTextAnimated(finalMessageAndQuestion, () => {
    setInputEditable(true);
    isAsking = true;
    handleAnswer = function(input) {
      const ans = input.toLowerCase();
      if (ans === "y") {
        commands.re(); // re 명령어 호출해서 리부팅 처리
      } else {
        terminalPrint("\n[INFO] Y를 눌러 터미널을 초기화 해주세요.");
        isAsking = true;
      }
    };
  });
}

// 수정된 사용 예 (질문 종료 후 글리치 연출 부분)
function showNextQuestion() {
  if (qIndex < seventhSurveyQuestions.length) {
    isAsking = false;
    setInputEditable(false);
    typeTextAnimated(seventhSurveyQuestions[qIndex].text, () => {
      isAsking = true;
      setInputEditable(true);
    });
  } else {
    glitchWholeTerminal(() => {
      // 글리치 끝나면 3초간 검은 화면 유지
      setTimeout(() => {
        restoreTerminalAfterGlitch(() => {
          showFinalMessageAndQuestion();
        });
      }, 3000);
    });
  }
}
