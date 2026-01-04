const chapterCounter = document.getElementById('chapterCounter');

function updateChapterCounter() {
  let remaining = 0;

  Object.entries(plannerData).forEach(([subject, chapters]) => {
    chapters.forEach((chapter, i) => {
      const state = savedData[subject]?.[i] || { a: false, b: false };
      if (state.a && state.b) {
        // fully done, 0 remaining
      } else if (state.a || state.b) {
        remaining += 0.5;
      } else {
        remaining += 1;
      }
    });
  });

  // Show half as ½
  chapterCounter.textContent = Number.isInteger(remaining)
    ? remaining
    : Math.floor(remaining) + '½';
}


const STORAGE_KEY = 'studyPlannerData';

const plannerData = {
  Maths: [
    'Real Numbers',
    'Polynomials',
    'Pair of Linear Equations in Two Variables',
    'Quadratic Equations',
    'Arithmetic Progressions',
    'Triangles',
    'Coordinate Geometry',
    'Introduction to Trigonometry',
    'Applications of Trigonometry',
    'Circles',
    'Areas Related to Circles',
    'Surface Areas and Volumes',
    'Statistics',
    'Probability'
  ],
  English: [
    'A Letter to God',
    'Nelson Mandela: Long Walk to Freedom',
    'Stories About Flying Part-1',
    'Stories About Flying Part-2',
    'From the Diary of Anne Frank',
    'Glimpses of India Part-1',
    'Glimpses of India Part-2',
    'Glimpses of India Part-3',
    'Mijbil the Otter',
    'Madam Rides the Bus',
    'The Sermon at Benares',
    'The Proposal',
    'Dust of Snow',
    'Fire and Ice',
    'A Tiger in the Zoo',
    'How to Tell Wild Animals',
    'The Ball Poem',
    'Amanda!',
    'The Trees',
    'Fog',
    'The Tale of Custard the Dragon',
    'For Anne Gregory',
    'A Triumph of Surgery',
    'The Thief’s Story',
    'The Midnight Visitor',
    'A Question of Trust',
    'Footprints Without Feet',
    'The Making of a Scientist',
    'The Necklace',
    'Bholi',
    'The Book That Saved the Earth'
  ],
  Science: [
    // Chemistry
    'Chemistry: Chemical Reactions',
    'Chemistry: Acids/Bases/Salts',
    'Chemistry: Metals/Non-metals',
    'Chemistry: Carbon compound',
    // Biology
    'Biology: Life Processes',
    'Biology: Control/Coordination',
    'Biology: Reproduction',
    'Biology: Heredity',
    'Biology: Our Environment',
    // Physics
    'Physics: Light',
    'Physics: Human Eye',
    'Physics: Electricity',
    'Physics: Magnetic Effects'
  ],
  Malayalam: [
    'അദ്ധ്യായം 1: ലക്ഷ്മണസാന്ത്വനം',
    'അദ്ധ്യായം 2: പ്രിയദർശനം',
    'അദ്ധ്യായം 3: പാവങ്ങൾ',
    'അദ്ധ്യായം 4: കടൽത്തീരത്ത്',
    'അദ്ധ്യായം 5: പ്ലാവിലക്കഞ്ഞി',
    'അദ്ധ്യായം 6: അമ്മത്തൊട്ടിൽ',
    'അദ്ധ്യായം 7: ഓണമുറ്റത്ത്',
    'അദ്ധ്യായം 8: പത്രനീതി',
    'അദ്ധ്യായം 9:  യുദ്ധത്തിന്റെ പരിണാമം',
    'അദ്ധ്യായം 10: അശ്വമേധം'
  ],
  'Social Science': [
    'The Rise of Nationalism in Europe',
    'Nationalism in India',
    'The Making of a Global World',
    'Print Culture and the Modern World',
    'Resources and Development',
    'Forest and Wildlife Resources',
    'Water Resources',
    'Agriculture',
    'Minerals and Energy Resources',
    'Manufacturing Industries',
    'Power Sharing',
    'Federalism',
    'Gender, Religion, and Caste',
    'Political Parties',
    'Outcomes of Democracy',
    'Development',
    'Sectors of the Indian Economy',
    'Money and Credit',
    'Globalisation and the Indian Economy'
  ],
  IT: [
    'Communication Skills',
    'Self-Management Skills',
    'Information and Communication Technology (ICT)',
    'Entrepreneurial Skills',
    'Green Skills',
    'Styles',
    'Working with Images',
    'Advanced Features of Writer',
    'Analyze Data Using Scenario and Goal Seek',
    'Macros',
    'Linking Spreadsheet',
    'Share and Review Spreadsheet',
    'Introduction to DBMS',
    'LibreOffice Base',
    'Multiple Table Working',
    'Queries',
    'Forms and Reports',
    'Health, Safety, and Security',
    'Workplace Quality Measures',
    'Prevent Accidents and Emergencies'
  ]
};

let savedData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
const container = document.getElementById('plannerContainer');

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(savedData));
}

function updateOverallProgress() {
  const all = document.querySelectorAll('input[type=checkbox]');
  const checked = [...all].filter((c) => c.checked).length;
  const percent = all.length ? Math.round((checked / all.length) * 100) : 0;
  document.getElementById('overallFill').style.width = percent + '%';
  document.getElementById('overallPercent').textContent = percent + '%';
}

Object.entries(plannerData).forEach(([subject, chapters]) => {
  const subjectDiv = document.createElement('div');
  subjectDiv.className = 'subject-grid';

  subjectDiv.innerHTML = `
        <div class="subject-header">
          <div>
            <div class="subject-title">${subject}</div>
            <div class="subject-progress">
              <div class="progress-bar small">
                <div class="subject-fill"></div>
              </div>
              <span class="subject-percent">0%</span>
            </div>
          </div>
          <button class="toggle-btn">Hide</button>
        </div>

        <div class="subject-body">
          <div class="grid-table">
            <div class="grid-header">
              <div>Chapter</div>
              <div>Learning</div>
              <div>Textbook</div>
              <div>Notes</div>
              <div>%</div>
            </div>
          </div>
        </div>
      `;

  const subjectBody = subjectDiv.querySelector('.subject-body');
  const gridTable = subjectDiv.querySelector('.grid-table');
  const subjectFill = subjectDiv.querySelector('.subject-fill');
  const subjectPercent = subjectDiv.querySelector('.subject-percent');
  const toggleBtn = subjectDiv.querySelector('.toggle-btn');

  toggleBtn.onclick = () => {
    subjectDiv.classList.toggle('collapsed');
    toggleBtn.textContent = subjectDiv.classList.contains('collapsed') ? 'Show' : 'Hide';
  };

  chapters.forEach((chapter, i) => {
    const row = document.createElement('div');
    row.className = 'grid-row';
    const state = savedData[subject]?.[i] || { a: false, b: false, n: '' };

    row.innerHTML = `
          <div class="grid-cell">${chapter}</div>
          <div class="grid-cell"><input type="checkbox" ${state.a ? 'checked' : ''}></div>
          <div class="grid-cell"><input type="checkbox" ${state.b ? 'checked' : ''}></div>
          <div class="grid-cell"><input class="notes-input" value="${state.n || ''}"></div>
          <div class="grid-cell progress-cell">0%</div>
        `;

    const checks = row.querySelectorAll('input[type=checkbox]');
    const notes = row.querySelector('.notes-input');
    const cell = row.querySelector('.progress-cell');

function updateRow() {
  const done = [...checks].filter((c) => c.checked).length;
  cell.textContent = done * 50 + '%';

  savedData[subject] ??= {};
  savedData[subject][i] = {
    a: checks[0].checked,
    b: checks[1].checked,
    n: notes.value
  };

  saveData();
  updateSubject();
  updateOverallProgress();
  updateChapterCounter(); // <-- add this line
}


    function updateSubject() {
      const rows = subjectDiv.querySelectorAll('.grid-row');
      let done = 0,
        total = 0;
      rows.forEach((r) => {
        const c = r.querySelectorAll('input[type=checkbox]');
        total += 2;
        done += [...c].filter((x) => x.checked).length;
      });
      const percent = total ? Math.round((done / total) * 100) : 0;
      subjectFill.style.width = percent + '%';
      subjectPercent.textContent = percent + '%';
    }

    checks.forEach((c) => (c.onchange = updateRow));
    notes.oninput = updateRow;

    updateRow();
    gridTable.appendChild(row);
  });

  container.appendChild(subjectDiv);
});

updateOverallProgress();
const TIME_KEY = 'studyTimeData';

/* -------------------------------
   Load or initialize study time
-------------------------------- */
let studyTimeData = JSON.parse(localStorage.getItem(TIME_KEY)) || {
  Monday: 0,
  Tuesday: 0,
  Wednesday: 0,
  Thursday: 0,
  Friday: 0,
  Saturday: 0,
  Sunday: 0
};

function saveStudyTime() {
  localStorage.setItem(TIME_KEY, JSON.stringify(studyTimeData));
}

/* -------------------------------
   Create Weekly Study Table
-------------------------------- */
const timeContainer = document.getElementById('studyTimeContainer');

const table = document.createElement('table');
table.className = 'time-table';

table.innerHTML = `
  <thead>
    <tr>
      <th>Day</th>
      <th>Hours Studied</th>
    </tr>
  </thead>
  <tbody></tbody>
`;

const tbody = table.querySelector('tbody');

Object.entries(studyTimeData).forEach(([day, hours]) => {
  const row = document.createElement('tr');

  row.innerHTML = `
    <td>${day}</td>
    <td>
      <input
        type="number"
        min="0"
        step="0.25"
        value="${hours}"
        data-day="${day}"
      />
    </td>
  `;

  tbody.appendChild(row);
});

timeContainer.appendChild(table);

/* -------------------------------
   Weekly total calculation
-------------------------------- */
function updateWeeklyTotal() {
  const total = Object.values(studyTimeData).reduce((sum, h) => sum + Number(h), 0);

  document.getElementById('weeklyTotal').textContent = total.toFixed(2) + ' hours';
}

/* -------------------------------
   Input handling (auto-save)
-------------------------------- */
table.addEventListener('input', (e) => {
  if (e.target.tagName === 'INPUT') {
    const day = e.target.dataset.day;
    studyTimeData[day] = Number(e.target.value) || 0;
    saveStudyTime();
    updateWeeklyTotal();
  }
});

/* -------------------------------
   Initial total calculation
-------------------------------- */
updateWeeklyTotal();
