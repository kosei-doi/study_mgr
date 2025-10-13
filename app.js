// 最小ロジック: 状態/描画/イベント

// localStorage は使用しない

// 科目の定義マスター（ハードコード）。画像から読み取った時間割
// dataId: データを共有する科目のID（同じdataIdの科目は同じ進捗・学習時間を共有）
const subjectsMaster = [
  { id: 'mon-1', name: '化学', dayOfWeek: '月曜日', slot: 1, dataId: 'mon-1' },
  { id: 'mon-2', name: 'Cプロ', dayOfWeek: '月曜日', slot: 2, dataId: 'mon-2' },
  { id: 'mon-3', name: '科学と芸術', dayOfWeek: '月曜日', slot: 3, dataId: 'mon-3' },
  { id: 'mon-4', name: '身体論', dayOfWeek: '月曜日', slot: 4, dataId: 'mon-4' },
  { id: 'tue-2', name: '実験', dayOfWeek: '火曜日', slot: 2, dataId: 'tue-experiment' },
  { id: 'tue-3', name: '実験', dayOfWeek: '火曜日', slot: 3, dataId: 'tue-experiment' },
  { id: 'tue-4', name: '実験', dayOfWeek: '火曜日', slot: 4, dataId: 'tue-experiment' },
  { id: 'tue-5', name: '実験', dayOfWeek: '火曜日', slot: 5, dataId: 'tue-experiment' },
  { id: 'wed-2', name: '線形代数', dayOfWeek: '水曜日', slot: 2, dataId: 'wed-2' },
  { id: 'wed-3', name: '電基礎', dayOfWeek: '水曜日', slot: 3, dataId: 'wed-3' },
  { id: 'wed-4', name: '生命科学', dayOfWeek: '水曜日', slot: 4, dataId: 'wed-4' },
  { id: 'wed-5', name: '力学A', dayOfWeek: '水曜日', slot: 5, dataId: 'wed-5' },
  { id: 'thu-1', name: 'CS', dayOfWeek: '木曜日', slot: 1, dataId: 'thu-1' },
  { id: 'fri-1', name: '微分積分', dayOfWeek: '金曜日', slot: 1, dataId: 'fri-1' },
  { id: 'fri-2', name: 'ALC', dayOfWeek: '金曜日', slot: 2, dataId: 'fri-2' },
  { id: 'fri-3', name: '電磁気学A', dayOfWeek: '金曜日', slot: 3, dataId: 'fri-electromagnetism' },
  { id: 'fri-4', name: '電磁気学A', dayOfWeek: '金曜日', slot: 4, dataId: 'fri-electromagnetism' },
];

// データを持つ科目のリスト（重複なし）
const uniqueSubjects = [];
const seenDataIds = new Set();
subjectsMaster.forEach(s => {
  if (!seenDataIds.has(s.dataId)) {
    seenDataIds.add(s.dataId);
    uniqueSubjects.push({ id: s.dataId, name: s.name });
  }
});

// グローバル変数で科目データを管理
let subjectsData = null;
let isFirebaseEnabled = false;

// Firebase接続チェック
function checkFirebase() {
  try {
    if (typeof firebase !== 'undefined' && firebase.database) {
      isFirebaseEnabled = true;
      console.log('Firebase Realtime Database が有効です');
      return true;
    }
  } catch (e) {
    console.warn('Firebase が利用できません。ローカルモードで動作します。', e);
  }
  isFirebaseEnabled = false;
  return false;
}

function loadSubjects() {
  return new Promise((resolve) => {
    if (subjectsData !== null) {
      resolve(subjectsData);
      return;
    }
    
    if (isFirebaseEnabled) {
      // Firebaseから読み込み
      const ref = firebase.database().ref('subjects');
      ref.once('value')
        .then((snapshot) => {
          const data = snapshot.val();
          if (data) {
            subjectsData = data;
            console.log('Firebaseから科目データを読み込みました:', subjectsData);
          } else {
            // データがない場合は初期化
            subjectsData = uniqueSubjects.map(s => ({ 
              id: s.id, 
              name: s.name, 
              progress: 0, 
              totalTime: 0, 
              lastUpdated: null 
            }));
            console.log('初期科目データを作成');
            saveSubjects(subjectsData);
          }
          resolve(subjectsData);
        })
        .catch((error) => {
          console.error('Firebaseからの読み込みに失敗:', error);
          // エラー時はローカルで初期化
          subjectsData = uniqueSubjects.map(s => ({ 
            id: s.id, 
            name: s.name, 
            progress: 0, 
            totalTime: 0, 
            lastUpdated: null 
          }));
          console.log('初期科目データを作成（エラー時）:', subjectsData);
          resolve(subjectsData);
        });
    } else {
      // Firebaseが無効な場合はローカルで初期化
      subjectsData = uniqueSubjects.map(s => ({ 
        id: s.id, 
        name: s.name, 
        progress: 0, 
        totalTime: 0, 
        lastUpdated: null 
      }));
      console.log('初期科目データを作成（ローカル）');
      resolve(subjectsData);
    }
  });
}

function saveSubjects(subjects) {
  subjectsData = subjects;
  console.log('科目データを更新:', subjectsData);
  
  if (isFirebaseEnabled) {
    // Firebaseに保存
    const ref = firebase.database().ref('subjects');
    ref.set(subjectsData)
      .then(() => {
        console.log('Firebaseに保存しました');
      })
      .catch((error) => {
        console.error('Firebaseへの保存に失敗:', error);
      });
  }
}

function getClassDays() {
  // グローバル変数から直接取得
  console.log('グローバルの classDays:', typeof classDays !== 'undefined' ? classDays : 'undefined');
  return typeof classDays !== 'undefined' ? classDays : [];
}

function getClassDaysByWeekday(weekday) {
  return getClassDays().filter(d => d.dayOfWeek === weekday);
}

function getTodayISO() {
  // テスト用固定値（2025年10月13日）
  return '2025-10-13';
}

function getCurrentWeekForSubject(subjectName, todayISO = getTodayISO()) {
  const subject = subjectsMaster.find(s => s.name === subjectName);
  if (!subject) return 1;
  const days = getClassDaysByWeekday(subject.dayOfWeek).filter(d => d.date <= todayISO);
  return Math.max(days.length, 1);
}

function getTotalClassesForSubject(subjectName) {
  const subject = subjectsMaster.find(s => s.name === subjectName);
  if (!subject) return 1;
  return getClassDaysByWeekday(subject.dayOfWeek).length || 1;
}

// 分母モード機能は削除（現在週数のみ使用）

// テーマ機能は廃止

function computeProgressColorClass(pct) {
  if (pct === 0) return 'pct-0';
  if (pct < 25) return 'pct-1';
  if (pct < 50) return 'pct-2';
  if (pct < 75) return 'pct-3';
  return 'pct-4';
}

function getStudyTimeColorClass(totalMinutes) {
  if (totalMinutes === 0) return 'time-none';
  if (totalMinutes < 30) return 'time-low';
  if (totalMinutes < 60) return 'time-medium';
  if (totalMinutes < 120) return 'time-high';
  return 'time-very-high';
}

function renderTimetable() {
  const container = document.getElementById('timetable');
  container.innerHTML = '';
  
  console.log('時間割をレンダリング開始');

  const headerRow = document.createElement('div');
  headerRow.setAttribute('role', 'row');
  const corner = document.createElement('div');
  corner.setAttribute('role', 'columnheader');
  corner.textContent = '';
  headerRow.appendChild(corner);
  const todayIdx = new Date().getDay(); // 0日曜-6土曜
  const map = ['日','月','火','水','木','金','土'];
  const todayShort = map[todayIdx];
  ;['月','火','水','木','金'].forEach(d => {
    const el = document.createElement('div');
    el.setAttribute('role', 'columnheader');
    el.textContent = `${d}`;
    if (d === todayShort) el.classList.add('today-col');
    headerRow.appendChild(el);
  });
  container.appendChild(headerRow);

  for (let period = 1; period <= 5; period++) {
    const row = document.createElement('div');
    row.setAttribute('role', 'row');

    const slotTitle = document.createElement('div');
    slotTitle.setAttribute('role', 'columnheader');
    slotTitle.className = 'slot-title';
    slotTitle.textContent = `${period}限`;
    row.appendChild(slotTitle);

    ;['月曜日','火曜日','水曜日','木曜日','金曜日'].forEach(weekday => {
      const cell = document.createElement('div');
      cell.setAttribute('role', 'gridcell');
      if ((todayIdx >= 1 && todayIdx <= 5) && weekday.startsWith(map[todayIdx])) {
        cell.classList.add('today-col');
      }

      const subject = subjectsMaster.find(s => s.dayOfWeek === weekday && s.slot === period);
      if (subject) {
        cell.setAttribute('aria-label', `${subject.name}`);
        const contents = document.createElement('div');
        const nameEl = document.createElement('div');
        nameEl.className = 'subject-name';
        nameEl.textContent = `${subject.name}`;
        contents.appendChild(nameEl);

        const progressWrap = document.createElement('div');
        progressWrap.className = 'progress';
        const bar = document.createElement('div');
        bar.className = 'progress-bar';
        bar.id = `bar-${subject.id}`;
        progressWrap.appendChild(bar);
        contents.appendChild(progressWrap);

        const text = document.createElement('div');
        text.className = 'progress-text';
        text.id = `text-${subject.id}`;
        contents.appendChild(text);

        const timeDisplay = document.createElement('div');
        timeDisplay.className = 'study-time';
        timeDisplay.id = `time-${subject.id}`;
        contents.appendChild(timeDisplay);

        cell.appendChild(contents);
        cell.addEventListener('click', async () => {
          console.log(`📱 クリック: ${subject.name} (${subject.slot}限, dataId: ${subject.dataId})`);
          await showSubjectModal(subject.name, subject.slot);
        });
      } else {
        cell.addEventListener('click', () => {});
      }
      row.appendChild(cell);
    });

    container.appendChild(row);
  }
  
}

function updateTimetableProgressBars() {
  const subjects = subjectsData || [];

  // 各セル（subjectsMaster）に対して処理
  subjectsMaster.forEach(cellSubject => {
    // このセルのデータを取得（dataIdで共有）
    const s = subjects.find(sub => sub.id === cellSubject.dataId);
    if (!s) {
      console.warn(`データが見つかりません: cellId=${cellSubject.id}, dataId=${cellSubject.dataId}`);
      return;
    }
    
    const denom = getCurrentWeekForSubject(s.name);
    const pct = Math.max(0, Math.min(100, Math.floor((denom ? (s.progress / denom) : 0) * 100)));
    
    const bar = document.getElementById(`bar-${cellSubject.id}`);
    const text = document.getElementById(`text-${cellSubject.id}`);
    const timeDisplay = document.getElementById(`time-${cellSubject.id}`);
    
    if (bar) {
      bar.style.width = `${pct}%`;
      bar.className = `progress-bar ${computeProgressColorClass(pct)}`;
    } else {
      console.error(`bar-${cellSubject.id} が見つかりません`);
    }
    if (text) {
      text.textContent = `${s.progress || 0}/${denom}`;
      text.setAttribute('aria-label', `${s.name} 進捗 ${s.progress || 0}/${denom}`);
    } else {
      console.error(`text-${cellSubject.id} が見つかりません`);
    }
    if (timeDisplay) {
      updateStudyTimeDisplay(s, timeDisplay);
    } else {
      console.error(`time-${cellSubject.id} が見つかりません`);
    }
  });
}

function updateStudyTimeDisplay(subject, timeElement) {
  if (!timeElement) {
    console.error('timeElement が null です');
    return;
  }
  
  const totalTime = subject.totalTime || 0;
  const hours = Math.floor(totalTime / 60);
  const minutes = totalTime % 60;
  
  let timeText = '';
  if (totalTime === 0) {
    timeText = '0m';
  } else if (hours > 0) {
    timeText = `${hours}h${minutes > 0 ? ` ${minutes}m` : ''}`;
  } else {
    timeText = `${minutes}m`;
  }
  
  console.log(`${subject.name} の学習時間を更新: ${totalTime}分 → ${timeText}, 要素ID: ${timeElement.id}`);
  timeElement.textContent = timeText;
  timeElement.setAttribute('aria-label', `${subject.name} 学習時間: ${totalTime}分`);
  timeElement.style.display = 'block'; // 確実に表示
  
  // 学習時間に応じて色を変化
  const colorClass = getStudyTimeColorClass(totalTime);
  timeElement.className = 'study-time ' + colorClass;
  console.log(`  色クラス: ${colorClass}`);
}

function updateWeekDisplay() {
  const weekdays = ['月曜日','火曜日','水曜日','木曜日','金曜日'];
  let maxWeek = 0;
  
  console.log('=== updateWeekDisplay デバッグ ===');
  console.log('今日の日付:', getTodayISO());
  
  weekdays.forEach(day => {
    const days = getClassDaysByWeekday(day);
    const completedDays = days.filter(d => d.date <= getTodayISO());
    const currentWeek = completedDays.length;
    console.log(`${day}: 全${days.length}回中${currentWeek}回実施済み = 第${currentWeek}週`);
    maxWeek = Math.max(maxWeek, currentWeek);
  });
  
  console.log('表示する週数:', maxWeek);
  const displayElement = document.getElementById('currentWeekDisplay');
  if (displayElement) {
    displayElement.textContent = `第${maxWeek}週`;
    console.log('週数表示を更新:', `第${maxWeek}週`);
  } else {
    console.error('currentWeekDisplay要素が見つかりません');
  }
  console.log('===============================');
}

function updateSummaryStats() {
  const subjects = subjectsData || [];
  
  // 全体進捗を計算
  let totalProgress = 0;
  let totalRequired = 0;
  
  uniqueSubjects.forEach(uniqueSubject => {
    const subject = subjects.find(s => s.id === uniqueSubject.id);
    const currentWeek = getCurrentWeekForSubject(uniqueSubject.name);
    const progress = subject ? subject.progress || 0 : 0;
    
    totalProgress += progress;
    totalRequired += currentWeek;
  });
  
  const overallProgressPercent = totalRequired > 0 ? Math.round((totalProgress / totalRequired) * 100) : 0;
  
  // 合計学習時間を計算
  let totalMinutes = 0;
  subjects.forEach(subject => {
    totalMinutes += subject.totalTime || 0;
  });
  
  const totalHours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;
  
  // 表示を更新
  const overallProgressEl = document.getElementById('overallProgress');
  if (overallProgressEl) {
    overallProgressEl.textContent = `${overallProgressPercent}%`;
  }
  
  const totalStudyTimeEl = document.getElementById('totalStudyTime');
  if (totalStudyTimeEl) {
    if (totalHours > 0) {
      totalStudyTimeEl.textContent = `${totalHours}h ${remainingMinutes}m`;
    } else {
      totalStudyTimeEl.textContent = `${remainingMinutes}m`;
    }
  }
}

// モーダル状態
let modalState = { name: null, slot: null };

async function showSubjectModal(name, slot) {
  // このセルのdataIdを取得（nameとslotで検索）
  const slotNum = parseInt(slot);
  const cellSubject = subjectsMaster.find(s => s.name === name && s.slot === slotNum);
  
  if (!cellSubject) {
    console.error('科目が見つかりません:', name, slotNum);
    return;
  }
  
  modalState = { name, slot: slotNum, dataId: cellSubject.dataId };
  
  document.getElementById('modalTitle').textContent = name;
  document.getElementById('modalSubjectName').textContent = `科目: ${name}`;
  
  const subjects = subjectsData || await loadSubjects();
  const s = subjects.find(x => x.id === cellSubject.dataId);
  
  const currentProgress = s ? s.progress || 0 : 0;
  const denom = getCurrentWeekForSubject(name);
  
  // 進捗表示を更新
  document.getElementById('currentProgressDisplay').textContent = `${currentProgress}回`;
  
  // プログレスバーを更新
  const pct = Math.max(0, Math.min(100, Math.floor((denom ? (currentProgress / denom) : 0) * 100)));
  const bar = document.getElementById('modalProgressBar');
  bar.style.width = `${pct}%`;
  bar.className = `modal-progress-bar ${computeProgressColorClass(pct)}`;
  
  // カスタム入力をリセット
  const customInput = document.getElementById('customTimeInput');
  if (customInput) {
    customInput.value = '';
  }
  
  const modal = document.getElementById('subjectModal');
  modal.hidden = false;
}

function hideModal() {
  document.getElementById('subjectModal').hidden = true;
}

function applyProgressUpdate() {
  const subjects = loadSubjects();
  const s = subjects.find(x => x.name === modalState.name);
  if (!s) return;
  const progressVal = Math.max(0, parseInt(document.getElementById('progressInput').value || '0', 10));
  const addMinutes = Math.max(0, parseInt(document.getElementById('timeInput').value || '0', 10));
  s.progress = progressVal;
  s.totalTime = (s.totalTime || 0) + addMinutes;
  s.lastUpdated = new Date().toISOString();
  saveSubjects(subjects);
  updateTimetableProgressBars();
  hideModal();
}

// グローバル変数
let selectedTime = 0;

function wireEvents() {
  // 理解したボタン
  document.getElementById('understandBtn').addEventListener('click', async () => {
    const subjects = subjectsData || await loadSubjects();
    const s = subjects.find(x => x.id === modalState.dataId);
    
    if (s) {
      s.progress = (s.progress || 0) + 1;
      s.lastUpdated = new Date().toISOString();
      saveSubjects(subjects);
      updateTimetableProgressBars();
      updateSummaryStats();
      hideModal();
    } else {
      console.error('科目が見つかりません。dataId:', modalState.dataId);
    }
  });

  // 時間追加ボタン（ワンクリックで追加）
  document.querySelectorAll('.time-add-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const time = parseInt(btn.dataset.time);
      await addStudyTime(time);
    });
  });

  // カスタム時間追加ボタン
  document.getElementById('addCustomTimeBtn').addEventListener('click', async () => {
    const customInput = document.getElementById('customTimeInput');
    const time = parseInt(customInput.value);
    if (time && time > 0 && time <= 180) {
      await addStudyTime(time);
      customInput.value = '';
    }
  });

  // カスタム時間入力でEnterキー
  document.getElementById('customTimeInput').addEventListener('keypress', async (e) => {
    if (e.key === 'Enter') {
      document.getElementById('addCustomTimeBtn').click();
    }
  });

  // キャンセルボタン
  document.getElementById('cancelModalBtn').addEventListener('click', hideModal);
  
  document.addEventListener('keydown', (e) => {
    const modal = document.getElementById('subjectModal');
    if (modal.hidden) return;
    if (e.key === 'Escape') hideModal();
  });
}

async function addStudyTime(time) {
  if (!time || time <= 0) return;
  
  const subjects = subjectsData || await loadSubjects();
  const s = subjects.find(x => x.id === modalState.dataId);
  
  if (s) {
    s.totalTime = (s.totalTime || 0) + time;
    s.lastUpdated = new Date().toISOString();
    saveSubjects(subjects);
    updateTimetableProgressBars();
    updateSummaryStats();
    console.log(`✅ ${s.name} の学習時間を追加: +${time}分 (合計: ${s.totalTime}分)`);
  } else {
    console.error('❌ 科目が見つかりません。dataId:', modalState.dataId);
  }
}

// テーマ初期化は不要

async function boot() {
  // Firebase接続チェック
  checkFirebase();
  
  // デバッグ: 現在週数を確認
  console.log('=== デバッグ情報 ===');
  console.log('今日の日付:', getTodayISO());
  
  const weekdays = ['月曜日','火曜日','水曜日','木曜日','金曜日'];
  let maxWeek = 0;
  
  weekdays.forEach(day => {
    const days = getClassDaysByWeekday(day);
    console.log(`${day}の全授業日:`, days.map(d => d.date));
    const completedDays = days.filter(d => d.date <= getTodayISO());
    console.log(`${day}の実施済み日:`, completedDays.map(d => d.date));
    const currentWeek = completedDays.length;
    console.log(`${day}: ${currentWeek}週目 (実施済み: ${currentWeek}/${days.length})`);
    maxWeek = Math.max(maxWeek, currentWeek);
  });
  
  console.log('最大週数:', maxWeek);
  console.log('==================');
  
  // データを読み込んでからUI更新
  await loadSubjects();
  
  console.log('=== 読み込み完了 ===');
  console.log('subjectsData:', subjectsData);
  console.log('データ数:', subjectsData ? subjectsData.length : 0);
  if (subjectsData) {
    console.log('実験のデータ:', subjectsData.find(s => s.id === 'tue-experiment'));
    console.log('電磁気学Aのデータ:', subjectsData.find(s => s.id === 'fri-electromagnetism'));
  }
  
  renderTimetable();
  updateTimetableProgressBars();
  updateWeekDisplay();
  updateSummaryStats();
  wireEvents();
  
  console.log('=== 初期化完了 ===');
}

document.addEventListener('DOMContentLoaded', boot);
