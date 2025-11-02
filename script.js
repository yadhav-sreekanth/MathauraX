// User's subjects
          let userSubjects = JSON.parse(localStorage.getItem('userSubjects') || '[]');
          let examData = JSON.parse(localStorage.getItem('smartExamPlannerData') || '{}');
          let studyStreak = parseInt(localStorage.getItem('studyStreak') || '0');
          let lastStudyDate = localStorage.getItem('lastStudyDate') || '';

          // Recommended subjects
          const recommendedSubjects = [
              'Mathematics', 'Physics', 'Chemistry', 'Biology', 
              'English', 'History', 'Geography', 'Computer Science',
              'Economics'
          ];
          
          // Subject icons mapping
          const subjectIcons = {
              'Mathematics': '🔢',
              'Physics': '⚡',
              'Chemistry': '🧪',
              'Biology': '🧬',
              'English': '📚',
              'History': '🏛️',
              'Geography': '🌍',
              'Computer Science': '💻',
              'Economics': '💰',

          };
          
          // Syllabus chapters by class and subject
          const syllabusChapters = {
              'Class 8': {
                'CBSE': {
                  'Mathematics': [
                    'Rational Numbers', 'Linear Equations in One Variable', 'Understanding Quadrilaterals', 'Practical Geometry',
                    'Data Handling', 'Squares and Square Roots', 'Cubes and Cube Roots', 'Comparing Quantities',
                    'Algebraic Expressions and Identities', 'Visualising Solid Shapes', 'Mensuration',
                    'Exponents and Powers', 'Direct and Inverse Proportions', 'Factorisation', 'Introduction to Graphs',
                    'Playing with Numbers'
                  ],
                  'Science': [
                    'Crop Production and Management', 'Microorganisms: Friend and Foe', 'Synthetic Fibres and Plastics',
                    'Materials: Metals and Non-Metals', 'Coal and Petroleum', 'Combustion and Flame',
                    'Conservation of Plants and Animals', 'Cell – Structure and Functions', 'Reproduction in Animals',
                    'Reaching the Age of Adolescence', 'Force and Pressure', 'Friction', 'Sound',
                    'Chemical Effects of Electric Current', 'Some Natural Phenomena', 'Light', 'Stars and the Solar System',
                    'Pollution of Air and Water'
                  ],
                  'English': [
                    'The Best Christmas Present in the World', 'The Tsunami', 'Glimpses of the Past',
                    'Bepin Choudhury’s Lapse of Memory', 'The Summit Within', 'This is Jody’s Fawn',
                    'A Visit to Cambridge', 'A Short Monsoon Diary', 'The Great Stone Face – I & II',
                    'Poems: The Ant and the Cricket', 'Geography Lesson', 'Macavity: The Mystery Cat', 'The Last Bargain',
                    'The School Boy', 'When I Set Out for Lyonnesse'
                  ]
                },
                'ICSE': {
                  'Mathematics': [
                    'Number Systems', 'Algebra', 'Geometry', 'Mensuration', 'Data Handling',
                    'Commercial Mathematics', 'Understanding Shapes', 'Symmetry and Patterns'
                  ],
                  'Science': [
                    'Food Production', 'Matter and Materials', 'Force and Pressure', 'Light and Sound',
                    'Human Anatomy', 'Electricity', 'Magnetism', 'Air and Water', 'Adaptations in Animals'
                  ]
                },
                'State Board': {
                  'Mathematics': [
                    'Rational Numbers', 'Algebraic Expressions', 'Geometry Basics', 'Comparing Quantities',
                    'Mensuration', 'Data Handling', 'Linear Equations', 'Exponents', 'Graphing', 'Symmetry'
                  ],
                  'Science': [
                    'Force and Pressure', 'Friction', 'Light', 'Sound', 'Cell Structure', 'Reproduction',
                    'Combustion', 'Metals and Non-Metals', 'Chemical Reactions', 'Microorganisms', 'Water and Air'
                  ]
                }
              },
            
              'Class 9': {
                'CBSE': {
                  'Mathematics': [
                    'Number Systems', 'Polynomials', 'Coordinate Geometry', 'Linear Equations in Two Variables',
                    'Introduction to Euclid’s Geometry', 'Lines and Angles', 'Triangles', 'Quadrilaterals',
                    'Areas of Parallelograms and Triangles', 'Circles', 'Constructions', 'Heron’s Formula',
                    'Surface Areas and Volumes', 'Statistics', 'Probability'
                  ],
                  'Science': [
                    'Matter in Our Surroundings', 'Is Matter Around Us Pure?', 'Atoms and Molecules', 'Structure of the Atom',
                    'The Fundamental Unit of Life', 'Tissues', 'Diversity in Living Organisms',
                    'Motion', 'Force and Laws of Motion', 'Gravitation', 'Work and Energy', 'Sound',
                    'Why Do We Fall Ill?', 'Natural Resources', 'Improvement in Food Resources'
                  ]
                },
                'ICSE': {
                  'Mathematics': [
                    'Rational Numbers', 'Algebraic Expressions', 'Linear Equations', 'Quadratic Equations',
                    'Mensuration', 'Statistics', 'Coordinate Geometry', 'Trigonometry Basics'
                  ],
                  'Science': [
                    'Structure of Atom', 'Cell - The Unit of Life', 'Diversity in Organisms', 'Health and Hygiene',
                    'Motion and Force', 'Work and Energy', 'Sound and Light', 'Environment', 'Nutrition'
                  ]
                },
                'State Board': {
                  'Mathematics': [
                    'Real Numbers', 'Algebra', 'Geometry Basics', 'Probability', 'Statistics', 'Graphs',
                    'Coordinate Geometry', 'Mensuration', 'Number Patterns'
                  ],
                  'Science': [
                    'Matter', 'Cell Biology', 'Classification of Living Things', 'Motion', 'Force',
                    'Sound', 'Work and Energy', 'Food and Nutrition', 'Environment and Natural Resources'
                  ]
                }
              },
'Class 10': {
    'CBSE': {
        'Mathematics': [
            'Real Numbers', 'Polynomials', 'Pair of Linear Equations', 'Quadratic Equations',
            'Arithmetic Progressions', 'Triangles', 'Coordinate Geometry', 'Introduction to Trigonometry',
            'Applications of Trigonometry', 'Circles', 'Constructions', 'Areas Related to Circles',
            'Surface Areas and Volumes', 'Statistics', 'Probability'
        ],

        'Physics': [
            'Light - Reflection and Refraction', 'Human Eye and Colourful World', 'Electricity',
            'Magnetic Effects of Electric Current', 'Sources of Energy', 'Our Environment',
            'Management of Natural Resources'
        ],
        'Science': [
            'Chemical Reactions and Equations', 'Acids, Bases and Salts', 'Metals and Non-metals',
            'Carbon and its Compounds', 'Periodic Classification of Elements', 'Life Processes',
            'Control and Coordination', 'How do Organisms Reproduce?', 'Heredity and Evolution',
            'Our Environment', 'Management of Natural Resources'
        ],
        'English': {
            'First Flight (Textbook)': [
                'A Letter to God',
                'Dust of Snow',
                'Fire and Ice',
                'Chapter 2 – Nelson Mandela: Long Walk to Freedom',
                'A Tiger in the Zoo',
                'Chapter 3 – Two Stories about Flying',
                'I. His First Flight',
                'II. Black Aeroplane',
                'How to Tell Wild Animals',
                'The Ball Poem',
                'Chapter 4 – From the Diary of Anne Frank',
                'Amanda!',
                'Chapter 5 – Glimpses of India',
                'I. A Baker from Goa',
                'II. Coorg',
                'III. Tea from Assam',
                'The Trees',
                'Chapter 6 – Mijbil the Otter',
                'Fog',
                'Chapter 7 – Madam Rides the Bus',
                'The Tale of Custard the Dragon',
                'Chapter 8 – The Sermon at Benares',
                'For Anne Gregory',
                'Chapter 9 – The Proposal'
            ],
            'Footprints Without Feet (Supplementary Reader)': [
                'A Triumph of Surgery',
                'Chapter 2 – The Thief’s Story',
                'Chapter 3 – The Midnight Visitor',
                'Chapter 4 – A Question of Trust',
                'Chapter 5 – Footprints without Feet',
                'Chapter 6 – The Making of a Scientist',
                'Chapter 7 – The Necklace',
                'Chapter 8 – Bholi',
                'Chapter 9 – The Book That Saved the Earth'
            ],
            'Language Components': [
                'Reading Comprehension',
                'Writing Skills',
                'Grammar'
            ]
        },
        'History': [
            'The Rise of Nationalism in Europe', 'Nationalism in India', 'The Making of a Global World',
            'The Age of Industrialisation', 'Print Culture and the Modern World'
        ],
        'Geography': [
            'Resources and Development', 'Water Resources', 'Agriculture', 'Minerals and Energy Resources',
            'Manufacturing Industries', 'Lifelines of National Economy'
        ],
        'Political Science': [
            'Power Sharing', 'Federalism', 'Democracy and Diversity', 'Gender, Religion and Caste',
            'Popular Struggles and Movements', 'Political Parties', 'Outcomes of Democracy',
            'Challenges to Democracy'
        ],
        'Economics': [
            'Development', 'Sectors of the Indian Economy', 'Money and Credit',
            'Globalisation and the Indian Economy', 'Consumer Rights'
        ],
        'Computer Science': [
            'Computer Fundamentals', 'Programming Basics', 'Data Types', 'Control Structures',
            'Functions', 'Arrays', 'File Handling'
        ]
    }
},
'Class 10': {
    'CBSE': {
                'Malayalam': [
    'ലക്ഷ്മണ സാന്ത്വനം',
    'പ്രിയദർശനം',
    'പവങ്ങൾ',
    'കടൽത്തീരത്ത്',
    'പ്ലാവിലക്കഞ്ഞി',
    'അമ്മത്തൊട്ടിൽ',
    'ഓണമുട്ടത്ത്',
    'പത്രനീതി',
    'യുദ്ധത്തിന്റെ ഫലനം',
    'അശ്വമേധം'
],
'Information Technology': [
    'Communication Skills',
    'Self-Management Skills',
    'ICT',
    'Entrepreneurial Skills',
    'Green Skills',
    'Styles',
    'Working with Images',
    'Advanced Features of Writer',
    'Analyze Data using Scenario and Goal Seek',
    'Macros',
    'Linking Spreadsheet',
    'Share and Review Spreadsheet',
    'Introduction to DBMS',
    'LibreOffice Base',
    'Multiple Table Working',
    'Queries',
    'Forms and Reports',
    'Health, Safety and Security',
    'Workplace Quality Measures',
    'Prevent Accidents and Emergencies'
],
'Social Science': [
    'Development',
    'Sectors of Economy',
    'Money and Credit',
    'Globalisation',
    'Making of New World',
    'Nationalism in Europe',
    'Nationalism in India',
    'Political Parties',
    'Outcomes of Democracy',
    'Federalism',
    'Power Sharing',
    'Gender, Religion and Caste',
    'Agriculture',
    'Resource and Development',
    'Water',
    'Forest',
    'Minerals',
],

        'Mathematics': [
            'Real Numbers', 'Polynomials', 'Pair of Linear Equations', 'Quadratic Equations',
            'Arithmetic Progressions', 'Triangles', 'Coordinate Geometry', 'Introduction to Trigonometry',
            'Applications of Trigonometry', 'Circles', 'Constructions', 'Areas Related to Circles',
            'Surface Areas and Volumes', 'Statistics', 'Probability'
        ],
        'Physics': [
            'Light - Reflection and Refraction', 'Human Eye and Colourful World', 'Electricity',
            'Magnetic Effects of Electric Current', 'Sources of Energy', 'Our Environment',
            'Management of Natural Resources'
        ],
'Science': [
    'Chemical Reactions and Equations',
    'Acids, Bases and Salts',
    'Metals and Non-metals',
    'Carbon and its Compounds',
    'Life Processes',
    'Control and Coordination',
    'How do Organisms Reproduce?',
    'Heredity and Evolution',
    'Light',
    'Human Eye and Colourful World',
    'Electricity',
    'Magnet',
],



            'English': [
                'A Letter to God',
                'Dust of Snow',
                'Fire and Ice',
                'Nelson Mandela: Long Walk to Freedom',
                'A Tiger in the Zoo',
                'Two Stories about Flying',
                'I. His First Flight',
                'II. Black Aeroplane',
                'How to Tell Wild Animals',
                'The Ball Poem',
                'From the Diary of Anne Frank',
                'Amanda!',
                'Glimpses of India',
                'I. A Baker from Goa',
                'II. Coorg',
                'III. Tea from Assam',
                'The Trees',
                'Mijbil the Otter',
                'Fog',
                'Madam Rides the Bus',
                'The Tale of Custard the Dragon',
                'The Sermon at Benares',
                'For Anne Gregory',
                'The Proposal',
                'A Triumph of Surgery',
                'The Thief’s Story',
                'The Midnight Visitor',
                'A Question of Trust',
                'Footprints without Feet',
                'The Making of a Scientist',
                'The Necklace',
                'Bholi',
                'The Book That Saved the Earth'
            ],
            'Language Components': [
                'Reading Comprehension',
                'Writing Skills',
                'Grammar'
            ],
        'History': [
            'The Rise of Nationalism in Europe', 'Nationalism in India', 'The Making of a Global World',
            'The Age of Industrialisation', 'Print Culture and the Modern World'
        ],
        'Geography': [
            'Resources and Development', 'Water Resources', 'Agriculture', 'Minerals and Energy Resources',
            'Manufacturing Industries', 'Lifelines of National Economy'
        ],
        'Political Science': [
            'Power Sharing', 'Federalism', 'Democracy and Diversity', 'Gender, Religion and Caste',
            'Popular Struggles and Movements', 'Political Parties', 'Outcomes of Democracy',
            'Challenges to Democracy'
        ],
        'Economics': [
            'Development', 'Sectors of the Indian Economy', 'Money and Credit',
            'Globalisation and the Indian Economy', 'Consumer Rights'
        ],
        'Computer Science': [
            'Computer Fundamentals', 'Programming Basics', 'Data Types', 'Control Structures',
            'Functions', 'Arrays', 'File Handling'
        ]
    },
                        'ICSE': {
                      'Mathematics': [
                        'Commercial Mathematics', 'Algebra', 'Geometry', 'Mensuration', 'Trigonometry',
                        'Statistics', 'Probability', 'Coordinate Geometry', 'Linear Programming'
                      ],
                      'Physics': [
                        'Force, Work, Power and Energy', 'Light', 'Sound', 'Electricity and Magnetism',
                        'Heat', 'Modern Physics', 'Wave Motion', 'Electromagnetic Induction'
                      ],
                      'Chemistry': [
                        'Physical Chemistry', 'Inorganic Chemistry', 'Organic Chemistry', 'Analytical Chemistry',
                        'Chemical Bonding', 'Periodic Properties', 'Chemical Kinetics', 'Electrochemistry'
                      ],
                      'Biology': [
                        'Basic Biology', 'Plant Physiology', 'Human Anatomy and Physiology', 'Genetics',
                        'Ecology', 'Health and Hygiene', 'Biotechnology', 'Environmental Science'
                      ],
                      'English': [
                        'English Language', 'English Literature', 'Comprehension', 'Writing Skills',
                        'Grammar and Vocabulary', 'Drama', 'Poetry', 'Prose'
                      ],
                      'History': [
                        'Ancient Civilizations', 'Medieval India', 'Modern India', 'World History',
                        'Indian National Movement', 'Post-Independence India', 'Contemporary World'
                      ],
                      'Geography': [
                        'Physical Geography', 'Human Geography', 'Economic Geography', 'Regional Geography',
                        'Environmental Geography', 'Map Work', 'Field Work'
                      ],
                      'Economics': [
                        'Basic Economic Concepts', 'Demand and Supply', 'Production and Cost',
                        'Market Structures', 'Money and Banking', 'International Trade', 'Economic Development'
                      ],
                      'Computer Applications': [
                        'Introduction to Java', 'Object-Oriented Programming', 'Data Structures',
                        'Database Management', 'Web Development', 'Computer Networks'
                      ]
                    },
                    'State Board': {
                      'Mathematics': [
                        'Number Systems', 'Algebra', 'Geometry', 'Trigonometry', 'Statistics',
                        'Probability', 'Calculus', 'Linear Programming', 'Vectors'
                      ],
                      'Physics': [
                        'Mechanics', 'Thermodynamics', 'Wave Motion', 'Optics', 'Electricity',
                        'Magnetism', 'Modern Physics', 'Electronics', 'Communication Systems'
                      ],
                      'Chemistry': [
                        'Physical Chemistry', 'Inorganic Chemistry', 'Organic Chemistry',
                        'Chemical Bonding', 'Chemical Kinetics', 'Electrochemistry', 'Surface Chemistry',
                        'Nuclear Chemistry', 'Environmental Chemistry'
                      ],
                      'Biology': [
                        'Cell Biology', 'Genetics', 'Evolution', 'Ecology', 'Human Physiology',
                        'Plant Physiology', 'Microbiology', 'Biotechnology', 'Environmental Biology'
                      ],
                      'English': [
                        'Language Skills', 'Literature', 'Comprehension', 'Writing', 'Grammar',
                        'Vocabulary', 'Communication Skills', 'Creative Writing'
                      ],
                      'History': [
                        'Ancient History', 'Medieval History', 'Modern History', 'World History',
                        'Indian History', 'Regional History', 'Cultural History', 'Political History'
                      ],
                      'Geography': [
                        'Physical Geography', 'Human Geography', 'Economic Geography',
                        'Regional Geography', 'Environmental Geography', 'Geographic Information Systems',
                        'Remote Sensing', 'Cartography'
                      ],
                      'Economics': [
                        'Microeconomics', 'Macroeconomics', 'Indian Economy', 'Development Economics',
                        'International Economics', 'Public Finance', 'Money and Banking', 'Statistics'
                      ],
                      'Computer Science': [
                        'Programming Fundamentals', 'Data Structures', 'Algorithms', 'Database Systems',
                        'Computer Networks', 'Operating Systems', 'Web Technologies', 'Software Engineering'
                      ]
                    }
                  
              },
            
              'Class 11': {
                'CBSE': {
                  'Mathematics': [
                    'Sets and Functions', 'Algebra', 'Coordinate Geometry', 'Calculus',
                    'Mathematical Reasoning', 'Statistics and Probability'
                  ],
                  'Physics': [
                    'Physical World', 'Units and Measurements', 'Motion in a Straight Line',
                    'Motion in a Plane', 'Laws of Motion', 'Work, Energy and Power',
                    'System of Particles and Rotational Motion', 'Gravitation',
                    'Mechanical Properties of Solids', 'Mechanical Properties of Fluids',
                    'Thermal Properties of Matter', 'Thermodynamics', 'Kinetic Theory',
                    'Oscillations', 'Waves'
                  ],
                  'Chemistry': [
                    'Some Basic Concepts of Chemistry', 'Structure of Atom',
                    'Classification of Elements and Periodicity in Properties',
                    'Chemical Bonding and Molecular Structure', 'States of Matter',
                    'Thermodynamics', 'Equilibrium', 'Redox Reactions', 'Hydrogen',
                    'The s-Block Elements', 'The p-Block Elements', 'Organic Chemistry',
                    'Hydrocarbons', 'Environmental Chemistry'
                  ],
                  'Biology': [
                    'The Living World', 'Biological Classification', 'Plant Kingdom',
                    'Animal Kingdom', 'Morphology of Flowering Plants',
                    'Anatomy of Flowering Plants', 'Structural Organisation in Animals',
                    'Cell: The Unit of Life', 'Biomolecules', 'Cell Cycle and Cell Division',
                    'Transport in Plants', 'Mineral Nutrition', 'Photosynthesis in Higher Plants',
                    'Respiration in Plants', 'Plant Growth and Development',
                    'Digestion and Absorption', 'Breathing and Exchange of Gases',
                    'Body Fluids and Circulation', 'Excretory Products and their Elimination',
                    'Locomotion and Movement', 'Neural Control and Coordination',
                    'Chemical Coordination and Integration'
                  ]
                }
              },
            
              'Class 12': {
                'CBSE': {
                  'Mathematics': [
                    'Relations and Functions', 'Inverse Trigonometric Functions', 'Matrices',
                    'Determinants', 'Continuity and Differentiability', 'Application of Derivatives',
                    'Integrals', 'Application of Integrals', 'Differential Equations',
                    'Vector Algebra', 'Three Dimensional Geometry', 'Linear Programming', 'Probability'
                  ],
                  'Physics': [
                    'Electric Charges and Fields', 'Electrostatic Potential and Capacitance',
                    'Current Electricity', 'Moving Charges and Magnetism', 'Magnetism and Matter',
                    'Electromagnetic Induction', 'Alternating Current', 'Electromagnetic Waves',
                    'Ray Optics and Optical Instruments', 'Wave Optics',
                    'Dual Nature of Radiation and Matter', 'Atoms', 'Nuclei',
                    'Semiconductor Electronics', 'Communication Systems'
                  ],
                  'Chemistry': [
                    'The Solid State', 'Solutions', 'Electrochemistry', 'Chemical Kinetics',
                    'Surface Chemistry', 'General Principles and Processes of Isolation of Elements',
                    'The p-Block Elements', 'The d and f Block Elements', 'Coordination Compounds',
                    'Haloalkanes and Haloarenes', 'Alcohols, Phenols and Ethers',
                    'Aldehydes, Ketones and Carboxylic Acids', 'Amines', 'Biomolecules',
                    'Polymers', 'Chemistry in Everyday Life'
                  ],
                  'Biology': [
                    'Reproduction in Organisms', 'Sexual Reproduction in Flowering Plants',
                    'Human Reproduction', 'Reproductive Health', 'Principles of Inheritance and Variation',
                    'Molecular Basis of Inheritance', 'Evolution', 'Human Health and Disease',
                    'Strategies for Enhancement in Food Production', 'Microbes in Human Welfare',
                    'Biotechnology: Principles and Processes', 'Biotechnology and its Applications',
                    'Organisms and Populations', 'Ecosystem', 'Biodiversity and Conservation',
                    'Environmental Issues'
                  ]
                }
              }
            };

          // AI-powered topic suggestions
    
          function saveData() {
              localStorage.setItem('smartExamPlannerData', JSON.stringify(examData));
              localStorage.setItem('studyStreak', studyStreak.toString());
              localStorage.setItem('lastStudyDate', lastStudyDate);
          }

          function updateStats() {
              const totalSubjects = Object.keys(examData).length;
              const totalSubjectsElement = document.getElementById('totalSubjects');
              
              // Add sliding animation class
              totalSubjectsElement.classList.add('slide-update');
              
              // Update the text content
              totalSubjectsElement.textContent = totalSubjects;
              
              // Remove the animation class after animation completes
              setTimeout(() => {
                  totalSubjectsElement.classList.remove('slide-update');
              }, 400);
          }

          function updateStudyStreak() {
              const today = new Date().toDateString();
              if (lastStudyDate !== today) {
                  const yesterday = new Date();
                  yesterday.setDate(yesterday.getDate() - 1);
                  if (lastStudyDate === yesterday.toDateString()) {
                      studyStreak++;
                  } else {
                      studyStreak = 1;
                  }
                  lastStudyDate = today;
                  saveData();
              }
          }

          function getDifficultyClass(difficulty) {
              return `difficulty-${difficulty}`;
          }

          function getPriorityClass(priority) {
              return `priority-${priority}`;
          }

          function calculateProgress(tasks) {
              if (!tasks || tasks.length === 0) return 0;
              const completed = tasks.filter(t => t.completed).length;
              return Math.round((completed / tasks.length) * 100);
          }

          function formatCountdown(dateStr) {
              if (!dateStr) return 'Set exam date';
              const today = new Date();
              const examDate = new Date(dateStr + 'T23:59:59');
              const diff = examDate - today;
              
              if (diff < 0) return 'Exam passed!';
              
              const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
              if (days === 1) return '1 day left';
              if (days < 7) return `${days} days left (URGENT!)`;
              if (days < 30) return `${days} days left`;
              return `${Math.floor(days / 30)} months, ${days % 30} days left`;
          }

          function getChapterText(chapters) {
              return `${chapters} chapter${chapters !== 1 ? 's' : ''}`;
          }

          // Helper to capitalize first letter
          function capitalizeFirstLetter(str) {
              if (!str) return '';
              return str.charAt(0).toUpperCase() + str.slice(1);
          }

          function renderSubjects() {
              const grid = document.getElementById('subjectsGrid');
              grid.innerHTML = '';
              // Show recommended subjects if no user subjects exist
              if (userSubjects.length === 0) {
                  const recommendationsDiv = document.createElement('div');
                  recommendationsDiv.className = 'recommendations-container';
                  recommendationsDiv.style.gridColumn = '1 / -1';
                  recommendationsDiv.innerHTML = `
                      <div class="recommendations-header">
                          <div class="recommendations-title">Recommended Subjects</div>
                          <div class="recommendations-subtitle">Select subjects to start building your study plan</div>
                      </div>
                      <div class="recommendations-grid">
                          ${recommendedSubjects.map(subject => `
                              <div class="recommendation-card" onclick="addSubject('${subject}')">
                                  <span class="recommendation-icon">${subjectIcons[subject] || '📚'}</span>
                                  <div class="recommendation-name">${subject}</div>
                                  <div class="recommendation-desc">Click to add to your study plan</div>
                              </div>
                          `).join('')}
                      </div>
                  `;
                  grid.appendChild(recommendationsDiv);
                  return;
              }
              userSubjects.forEach(subjectName => {
                  if (!examData[subjectName]) {
                      examData[subjectName] = {
                          tasks: [],
                          date: '',
                          chapters: 0
                      };
                  }
                  const progress = calculateProgress(examData[subjectName].tasks);
                  const card = document.createElement('div');
                  card.className = 'subject-card';
                  const noDate = !examData[subjectName].date;
                  let urgentMsg = '';
                  if (!noDate) {
                      const today = new Date();
                      const examDate = new Date(examData[subjectName].date);
                      const diffTime = examDate.setHours(0,0,0,0) - today.setHours(0,0,0,0);
                      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                      if (diffDays === 1) {
                          urgentMsg = `<div class='urgent-msg' style='color:#ef4444;font-size:1rem;margin-bottom:0.7rem;display:flex;align-items:center;gap:0.4rem;background:#fee2e2;animation:pulseBg 1.5s infinite; border-radius:0.5rem; padding:0.4rem 0.8rem;'><i class='fas fa-exclamation-triangle'></i> Hurry up! Only 1 day left until your exam!</div>`;
                      } else if (diffDays === 0) {
                          urgentMsg = `<div class='urgent-msg' style='color:#ef4444;font-size:1rem;margin-bottom:0.7rem;display:flex;align-items:center;gap:0.4rem;background:#fee2e2;animation:pulseBg 1.5s infinite; border-radius:0.5rem; padding:0.4rem 0.8rem;'><i class='fas fa-exclamation-triangle'></i> Hurry up! Exam is today!</div>`;
                      }
                  }
                  // Inline date picker logic
                  let dateSection = '';
                  if (noDate) {
                      dateSection = `
                          <div class="exam-info" style="margin-bottom:0.7rem;display:flex;align-items:center;gap:0.7rem;">
                              <i class="fas fa-calendar-alt" style="color:#3b82f6;font-size:1.2rem;"></i>
                              <input type="date" class="exam-date-input" id="date-input-${subjectName}" style="padding:0.5rem 1rem;border-radius:0.5rem;border:1.5px solid #e2e8f0;font-size:1rem;background:#f8fafc;" onchange="updateExamDate('${subjectName}', this.value)">
                              <span style="color:#ef4444;font-size:0.98rem;">Set Exam Date</span>
                          </div>
                      `;
                  } else {
                      dateSection = `
                          <div class="exam-info" style="margin-bottom:0.7rem;display:flex;align-items:center;gap:0.7rem;">
                              <i class="fas fa-calendar-alt" style="color:#3b82f6;font-size:1.2rem;"></i>
                              <span class="exam-date-display" id="exam-date-display-${subjectName}" style="font-size:1.05rem;color:#334155;font-weight:500;">${examData[subjectName].date}</span>
                              <button class="edit-date-btn" onclick="showDateInput('${subjectName}')" style="background:none;border:none;cursor:pointer;padding:0 0.3rem;"><i class="fas fa-edit" style="color:#3b82f6;"></i></button>
                              <input type="date" class="exam-date-input" id="date-input-${subjectName}" value="${examData[subjectName].date}" style="display:none;padding:0.5rem 1rem;border-radius:0.5rem;border:1.5px solid #e2e8f0;font-size:1rem;background:#f8fafc;" onchange="updateExamDate('${subjectName}', this.value)">
                              <span style="color:#64748b;font-size:0.98rem;">Exam Date</span>
                          </div>
                      `;
                  }
                  card.innerHTML = `
                      <div style="flex:1;min-width:0;display:flex;flex-direction:column;">
                          <div class="subject-header" style="margin-bottom: 0.7rem;">
                              <h3 class="subject-title styled-subject-title">${capitalizeFirstLetter(subjectName)}</h3>
                              <div style="display: flex; align-items: center; gap: 0.5rem;">
                                  <span class="chapter-badge">
                                      ${getChapterText(examData[subjectName].chapters || 0)}
                                  </span>
                                  <button onclick="removeSubject('${subjectName}')" 
                                          style="background: #fee2e2; color: #dc2626; border: none; border-radius: 50%; 
                                                 width: 2rem; height: 2rem; cursor: pointer; font-size: 0.8rem; 
                                                 display: flex; align-items: center; justify-content: center; 
                                                 transition: all 0.2s;"
                                          onmouseover="this.style.background='#fecaca'"
                                          onmouseout="this.style.background='#fee2e2'"
                                          title="Removye Subject">
                                      <i class="fas fa-times"></i>
                                  </button>
                              </div>
                          </div>
                          ${dateSection}
                          ${noDate ? '' : urgentMsg}
                          <div class="progress-section" style="margin-bottom: 1.2rem;">
                              <div class="progress-header">
                                  <span class="progress-label">Progress</span>
                                  <span class="progress-percentage">${progress}%</span>
                              </div>
                              <div class="progress-bar">
                                  <div class="progress-fill" style="width: ${progress}%"></div>
                              </div>
                          </div>
                          <div class="actions-bar" style="margin-bottom:0.5rem;">
                              <button class="action-btn btn-success" onclick="generateAISuggestions('${subjectName}')">
                                  <i class="fas fa-book"></i> AI Chapters
                              </button>
                          </div>
                          ${noDate ? `<div style='color:#ef4444;font-size:0.95rem;margin-bottom:0.7rem;'>Please set the exam date before adding chapters.</div>` : ''}
                          <form class="add-task-form" style="display:flex;gap:1.2rem;align-items:center;margin-bottom:1rem;" onsubmit="addTask(event, '${subjectName}')">
                              <input type="text" class="task-input" placeholder="Add Chapter..." required ${noDate ? 'disabled' : ''}>
                              <button type="submit" class="action-btn btn-primary" style="margin-left:0.7rem;" ${noDate ? 'disabled' : ''}>
                                  <i class="fas fa-plus"></i>
                              </button>
                          </form>
                          <div class="ai-suggestions" id="ai-${subjectName}" style="display: none;">
                              <h4>AI Suggested Chapters</h4>
                              <div class="suggestion-tags" id="suggestions-${subjectName}"></div>
                          </div>
                          <ul class="checklist styled-checklist" id="checklist-${subjectName}"></ul>
                      </div>
                  `;
                  grid.appendChild(card);
                  renderTasks(subjectName);
              });
          }

          function renderTasks(subject, search = '') {
              const checklist = document.getElementById(`checklist-${subject}`);
              if (!checklist) return;
              checklist.innerHTML = '';
              let tasks = examData[subject].tasks || [];
              if (search) {
                  const s = search.trim().toLowerCase();
                  tasks = tasks.filter(task => task.text.toLowerCase().includes(s));
              }
              tasks.forEach((task, idx) => {
                  const li = document.createElement('li');
                  li.className = 'checklist-item styled-checklist-item' + (task.completed ? ' completed' : '');
                  li.innerHTML = `
                      <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} onclick="toggleTask('${subject}', ${idx}); updateStats();">
                      <span class="task-text">${capitalizeFirstLetter(task.text)}</span>
                      <div class="task-actions">
                          <button class="chapter-action-btn btn-edit" title="Edit" onclick="editTask('${subject}', ${idx})"><i class="fas fa-edit"></i></button>
                          <button class="chapter-action-btn btn-delete" title="Delete" onclick="deleteTask('${subject}', ${idx})"><i class="fas fa-trash"></i></button>
                      </div>
                  `;
                  checklist.appendChild(li);
              });
          }

          function addTask(event, subject) {
              event.preventDefault();
              const input = event.target.querySelector('.task-input');
              const text = input.value.trim();
              const maxChapters = examData[subject].chapters || 0;
              if (examData[subject].tasks.length >= maxChapters) {
                  alert('You have reached the maximum number of chapters for this subject.');
                  return;
              }
              if (text) {
                  if (!examData[subject].tasks) examData[subject].tasks = [];
                  examData[subject].tasks.push({
                      text,
                      completed: false,
                      priority: null,
                      createdAt: new Date().toISOString()
                  });
                  saveData();
                  renderTasks(subject);
                  updateStats();
                  input.value = '';
                  updateStudyStreak();
              }
          }
// --- SMART STUDY PLANNER: Suggest what to learn next ---
function suggestNextToLearn() {
  const boxId = "nextToLearn";
  let suggestionBox = document.getElementById(boxId);

  // Create container if not present
  if (!suggestionBox) {
    suggestionBox = document.createElement("div");
    suggestionBox.id = boxId;
    suggestionBox.style.margin = "25px auto";
    suggestionBox.style.maxWidth = "750px";
    suggestionBox.style.background = "white";
    suggestionBox.style.borderRadius = "15px";
    suggestionBox.style.padding = "20px 25px";
    suggestionBox.style.boxShadow = "0 4px 20px rgba(0,0,0,0.1)";
    suggestionBox.style.textAlign = "center";
    suggestionBox.style.fontSize = "1rem";
    suggestionBox.style.color = "#334155";
    suggestionBox.style.lineHeight = "1.6";
    suggestionBox.style.fontWeight = "500";
    suggestionBox.innerHTML = "📘 Analyzing your study data...";
    document.querySelector(".planner")?.appendChild(suggestionBox);
  }

  // If no subjects yet
  if (!userSubjects.length) {
    suggestionBox.innerHTML = "Add subjects to get your first personalized study plan!";
    return;
  }

  // Find the subject with lowest progress
  let nextSubject = null;
  for (const subject of userSubjects) {
    const tasks = examData[subject]?.tasks || [];
    const completed = tasks.filter(t => t.completed).length;
    const total = tasks.length || 1;
    const progress = (completed / total) * 100;
    if (!nextSubject || progress < nextSubject.progress) {
      nextSubject = { subject, progress, tasks };
    }
  }

  // If everything is completed
  if (!nextSubject || nextSubject.progress >= 100) {
    suggestionBox.innerHTML = `
      🎉 <b>All subjects completed!</b><br>
      Time to revise or take mock tests!
    `;
    return;
  }

  // Suggest the first incomplete chapter
  const pendingTask = nextSubject.tasks.find(t => !t.completed);
  const nextChapter = pendingTask ? pendingTask.text : "next topic";

  // Create smart plan suggestion
  suggestionBox.innerHTML = `
    <h2 style="color:#3b82f6;font-size:1.4rem;margin-bottom:8px;">🧠 Smart Study Suggestion</h2>
    <p>Start with <b>${nextSubject.subject}</b> — you’re ${nextSubject.progress.toFixed(0)}% done.</p>
    <p>Next, complete <b>${nextChapter}</b> to stay on track!</p>
    <p style="color:#6366f1;margin-top:10px;">💪 Consistency is key — keep going!</p>
  `;
}

 function toggleTask(subject, idx) {
  examData[subject].tasks[idx].completed = !examData[subject].tasks[idx].completed;
  saveData();
  renderTasks(subject);
  updateStats();
  updateStudyStreak();

  // Update daily goal progress when a task is completed
  if (examData[subject].tasks[idx].completed) {
    updateGoalProgress();
  }

  // Check if all chapters are completed
  const tasks = examData[subject].tasks || [];
  if (tasks.length > 0 && tasks.every(t => t.completed)) {
    showCongratsModal();
  }
}


          function deleteTask(subject, idx) {
              examData[subject].tasks.splice(idx, 1);
              saveData();
              renderTasks(subject);
              updateStats();
          }

          function editTask(subject, idx) {
              const newText = prompt('Edit task:', examData[subject].tasks[idx].text);
              if (newText && newText.trim()) {
                  examData[subject].tasks[idx].text = newText.trim();
                  saveData();
                  renderTasks(subject);
              }
          }

          function setPriority(subject, idx) {
              const priorities = ['low', 'medium', 'high'];
              const currentPriority = examData[subject].tasks[idx].priority;
              const currentIndex = priorities.indexOf(currentPriority);
              const nextPriority = priorities[(currentIndex + 1) % priorities.length];
              
              examData[subject].tasks[idx].priority = nextPriority === currentPriority ? null : nextPriority;
              saveData();
              renderTasks(subject);
          }

          function setExamDate(subject) { /* replaced by inline date input */ }

          function updateExamDate(subject, value) {
              if (value) {
                  examData[subject].date = value;
                  saveData();
                  renderSubjects();
              }
          }

          function showDateInput(subject) {
              const dateInput = document.getElementById(`date-input-${subject}`);
              const dateDisplay = document.getElementById(`exam-date-display-${subject}`);
              if (dateInput && dateDisplay) {
                  dateInput.style.display = 'inline-block';
                  dateDisplay.style.display = 'none';
                  dateInput.focus();
                  dateInput.addEventListener('blur', function handler() {
                      dateInput.style.display = 'none';
                      dateDisplay.style.display = 'inline-block';
                      dateInput.removeEventListener('blur', handler);
                  });
              }
          }

          function generateAISuggestions(subject) {
              const aiBox = document.getElementById(`ai-${subject}`);
              const suggestionsDiv = document.getElementById(`suggestions-${subject}`);
              
              if (aiBox.style.display === 'none') {
                  aiBox.style.display = 'block';
                  
                  // Show syllabus-based chapters
                  const subjectData = examData[subject];
                  const className = subjectData.className || 'Class 10';
                  const syllabus = subjectData.syllabus || 'CBSE';
                  
                  const availableChapters = syllabusChapters[className]?.[syllabus]?.[subject] || [];
                  
                  if (availableChapters.length > 0) {
                      suggestionsDiv.innerHTML = `
                          <div style="margin-bottom: 1rem; color: #64748b; font-size: 0.9rem;">
                              ${syllabus} ${className} - ${subject} Chapters:
                          </div>
                          <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                              ${availableChapters.map((chapter, index) => `
                                  <button onclick="addChapterAsTask('${subject}', '${chapter}')" 
                                          style="padding: 0.5rem 1rem; background: linear-gradient(135deg, #3b82f6, #8b5cf6); 
                                                 color: white; border: none; border-radius: 0.5rem; cursor: pointer; 
                                                 font-size: 0.8rem; font-weight: 500; transition: all 0.2s;"
                                          onmouseover="this.style.transform='scale(1.05)'"
                                          onmouseout="this.style.transform='scale(1)'">
                                      Chapter ${index + 1}: ${chapter}
                                  </button>
                              `).join('')}
                          </div>
                      `;
                  } else {
                      suggestionsDiv.innerHTML = `
                          <div style="color: #64748b; text-align: center; padding: 1rem;">
                              No syllabus chapters available for ${subject} in ${className}. 
                              You can manually add topics using the input field above.
                          </div>
                      `;
                  }
              } else {
                  aiBox.style.display = 'none';
              }
          }
          
          function addChapterAsTask(subject, chapterName) {
              if (!examData[subject].tasks.some(task => task.text === chapterName)) {
                  examData[subject].tasks.push({
                      id: Date.now(),
                      text: chapterName,
                      completed: false,
                      priority: 'medium',
                      createdAt: new Date().toISOString()
                  });
                  saveData();
                  renderTasks(subject);
              }
          }

          function addSubject(subjectName) {
              document.getElementById('modalSubjectName').value = subjectName;
          }

          // Initialize
          renderSubjects();
          updateStats();
          updateStudyStreak();
suggestNextToLearn();

          // Add subject button functionality
          document.getElementById('addSubjectBtn').addEventListener('click', () => {
              showModal();
          });

          // Modal form submission
          document.getElementById('subjectForm').addEventListener('submit', (e) => {
              e.preventDefault();
              addSubjectFromModal();
          });
          
          // Close modal when clicking outside
          document.getElementById('subjectModal').addEventListener('click', (e) => {
              if (e.target.id === 'subjectModal') {
                  closeModal();
              }
          });

          function showModal() {
              document.getElementById('subjectModal').style.display = 'block';
              document.getElementById('modalSubjectName').focus();
          }
          
          function closeModal() {
              document.getElementById('subjectModal').style.display = 'none';
              document.getElementById('subjectForm').reset();
          }
          
          function addSubjectFromModal() {
              const subjectName = document.getElementById('modalSubjectName').value.trim();
              const className = document.getElementById('modalClassName').value;
              const syllabus = document.getElementById('modalSyllabus').value;
              const chapters = parseInt(document.getElementById('modalChapters').value);
              
              if (!subjectName || !className || !syllabus || !chapters) {
                  alert('Please fill in all fields');
                  return;
              }
              
              if (!userSubjects.includes(subjectName)) {
                  userSubjects.push(subjectName);
                  localStorage.setItem('userSubjects', JSON.stringify(userSubjects));
              }
              
              // In addSubjectFromModal, do not prefill tasks array:
              if (!examData[subjectName]) {
                  examData[subjectName] = {
                      tasks: [],
                      date: '',
                      chapters: chapters,
                      className: className,
                      syllabus: syllabus
                  };
              } else {
                  examData[subjectName].chapters = chapters;
                  examData[subjectName].className = className;
                  examData[subjectName].syllabus = syllabus;
              }
              
              saveData();
              renderSubjects();
              updateStats();
              closeModal();
          }

          function removeSubject(subjectName) {
              if (confirm(`Are you sure you want to remove "${subjectName}" and all its tasks?`)) {
                  // Remove from userSubjects array
                  const index = userSubjects.indexOf(subjectName);
                  if (index > -1) {
                      userSubjects.splice(index, 1);
                      localStorage.setItem('userSubjects', JSON.stringify(userSubjects));
                  }
                  
                  // Remove from examData
                  delete examData[subjectName];
                  
                  // Save and update
                  saveData();
                  renderSubjects();
                  updateStats();
              }
          }

          function showCongratsModal() {
            document.getElementById('congratsModal').style.display = 'flex';
          }
          function closeCongratsModal() {
            document.getElementById('congratsModal').style.display = 'none';
          }

          // Add pulse background animation for urgent message
          const style = document.createElement('style');
          style.innerHTML = `@keyframes pulseBg { 0% { background: #fee2e2; } 50% { background: #fecaca; } 100% { background: #fee2e2; } }`;
          document.head.appendChild(style);

          // --- Added: Nav toggle (image) and dropdown handlers ---
          // Usage notes (HTML):
          // - Nav toggle button: <button data-nav-toggle data-nav-target="#mainNav" data-open-src="hamburger.png" data-close-src="close.png"><img src="hamburger.png" alt="menu"></button>
          // - The target nav should have id="mainNav" and will receive class "open" when opened.
          // - Dropdown toggle: <button data-dropdown-toggle aria-expanded="false" aria-controls="dd1">Menu</button>
          //   <ul id="dd1" class="dropdown-menu">...</ul>

          function initNavToggle() {
              // Toggle nav and swap image src if open/close sources provided
              document.querySelectorAll('[data-nav-toggle]').forEach(btn => {
                  const targetSel = btn.getAttribute('data-nav-target');
                  const openSrc = btn.getAttribute('data-open-src');
                  const closeSrc = btn.getAttribute('data-close-src');
                  const img = btn.querySelector('img');
                  
                  btn.addEventListener('click', (e) => {
                      e.stopPropagation();
                      if (!targetSel) return;
                      const menu = document.querySelector(targetSel);
                      if (!menu) return;
                      const isOpen = menu.classList.toggle('open');
                      btn.setAttribute('aria-expanded', String(isOpen));
                      if (img && openSrc && closeSrc) {
                          img.src = isOpen ? closeSrc : openSrc;
                      } else if (img) {
                          img.classList.toggle('open', isOpen);
                      }
                  });
              });

              // Close nav when clicking outside
              document.addEventListener('click', (e) => {
                  document.querySelectorAll('[data-nav-toggle]').forEach(toggle => {
                      const targetSel = toggle.getAttribute('data-nav-target');
                      if (!targetSel) return;
                      const menu = document.querySelector(targetSel);
                      if (!menu || !menu.classList.contains('open')) return;
                      if (!menu.contains(e.target) && !toggle.contains(e.target)) {
                          menu.classList.remove('open');
                          toggle.setAttribute('aria-expanded', 'false');
                          const img = toggle.querySelector('img');
                          const openSrc = toggle.getAttribute('data-open-src');
                          if (img && openSrc) img.src = openSrc;
                      }
                  });
              });

              // Close nav with Escape
              document.addEventListener('keydown', (e) => {
                  if (e.key === 'Escape') {
                      document.querySelectorAll('[data-nav-toggle]').forEach(toggle => {
                          const targetSel = toggle.getAttribute('data-nav-target');
                          if (!targetSel) return;
                          const menu = document.querySelector(targetSel);
                          if (!menu || !menu.classList.contains('open')) return;
                          menu.classList.remove('open');
                          toggle.setAttribute('aria-expanded', 'false');
                          const img = toggle.querySelector('img');
                          const openSrc = toggle.getAttribute('data-open-src');
                          if (img && openSrc) img.src = openSrc;
                      });
                  }
              });
          }

          function initDropdowns() {
              document.querySelectorAll('[data-dropdown-toggle]').forEach(btn => {
                  const targetId = btn.getAttribute('aria-controls');
                  const menu = targetId ? document.getElementById(targetId) : null;
                  if (!menu) return;

                  btn.addEventListener('click', (e) => {
                      e.stopPropagation();
                      const isOpen = menu.classList.toggle('show');
                      btn.setAttribute('aria-expanded', String(isOpen));
                  });

                  btn.addEventListener('keydown', (e) => {
                      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          menu.classList.add('show');
                          btn.setAttribute('aria-expanded', 'true');
                          const first = menu.querySelector('a, button, [tabindex]:not([tabindex="-1"])');
                          if (first) first.focus();
                      } else if (e.key === 'Escape') {
                          menu.classList.remove('show');
                          btn.setAttribute('aria-expanded', 'false');
                          btn.focus();
                      }
                  });
              });

              // Close dropdowns when clicking outside
              document.addEventListener('click', (e) => {
                  document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
                      const toggleBtn = document.querySelector(`[aria-controls="${menu.id}"]`);
                      if (!menu.contains(e.target) && (!toggleBtn || !toggleBtn.contains(e.target))) {
                          menu.classList.remove('show');
                          if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'false');
                      }
                  });
              });

              // Close dropdowns on Escape globally
              document.addEventListener('keydown', (e) => {
                  if (e.key === 'Escape') {
                      document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
                          menu.classList.remove('show');
                          const toggleBtn = document.querySelector(`[aria-controls="${menu.id}"]`);
                          if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'false');
                      });
                  }
              });
          }

          // Initialize handlers after DOM ready
          if (document.readyState === 'loading') {
              document.addEventListener('DOMContentLoaded', () => {
                  initNavToggle();
                  initDropdowns();
              });
          } else {
              initNavToggle();
              initDropdowns();
          }

          // --- Study Goal System ---
let dailyGoal = parseInt(localStorage.getItem('dailyGoal') || '0');
let completedToday = parseInt(localStorage.getItem('completedToday') || '0');
let goalDate = localStorage.getItem('goalDate');
const today = new Date().toDateString();

// Reset daily goal progress each new day
if (goalDate !== today) {
  localStorage.setItem('goalDate', today);
  localStorage.setItem('completedToday', '0');
  completedToday = 0;
}

const goalStatus = document.getElementById('goalStatus');
const goalInput = document.getElementById('dailyGoalInput');
const goalBtn = document.getElementById('setGoalBtn');

// Save new goal
goalBtn.addEventListener('click', () => {
  const value = parseInt(goalInput.value);
  if (isNaN(value) || value <= 0) {
    alert('Enter a valid goal number!');
    return;
  }
  dailyGoal = value;
  localStorage.setItem('dailyGoal', dailyGoal);
  goalStatus.textContent = `🎯 Daily goal: ${dailyGoal} chapters`;
  showGoalPopup('Goal set successfully!');
});

// Update progress each time a task is completed
function updateGoalProgress() {
  completedToday++;
  localStorage.setItem('completedToday', completedToday);
  goalStatus.textContent = `Progress: ${completedToday}/${dailyGoal} chapters`;
  if (completedToday >= dailyGoal) {
    showGoalPopup('✅ Goal Completed! Great work!');
  }
}

// Show nice motivational popup
function showGoalPopup(message) {
  const popup = document.createElement('div');
  popup.textContent = message;
  popup.style.position = 'fixed';
  popup.style.bottom = '25px';
  popup.style.right = '25px';
  popup.style.background = 'white';
  popup.style.color = '#3b82f6';
  popup.style.border = '2px solid #3b82f6';
  popup.style.padding = '12px 18px';
  popup.style.borderRadius = '10px';
  popup.style.fontWeight = '600';
  popup.style.boxShadow = '0 4px 15px rgba(0,0,0,0.15)';
  popup.style.display = 'flex';
  popup.style.alignItems = 'center';
  popup.style.gap = '10px';
  popup.innerHTML = `✔️ ${message}`;
  document.body.appendChild(popup);
  setTimeout(() => popup.remove(), 3000);
}

// Show stored goal on load
if (dailyGoal > 0) {
  goalStatus.textContent = `Progress: ${completedToday}/${dailyGoal} chapters`;
}
