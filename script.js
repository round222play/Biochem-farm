let currentLanguage = 'ar';
let currentQuestion = 0;
let score = 0;
let selectedAnswer = null;

const LANG_KEY = 'site_lang'; 

const questions = {
    ar: [
        {
            question: "ما هو العنصر الكيميائي الأساسي الذي يساعد في نمو الأوراق والبناء الضوئي؟",
            answers: [
                "البوتاسيوم (K)",
                "النيتروجين (N)",
                "الفوسفور (P)",
                "الكالسيوم (Ca)"
            ],
            correct: 1
        },
        {
            question: "أي من التالي يُعتبر مصدرًا رئيسيًا للطاقة في الخلايا النباتية؟",
            answers: [
                "السكريات (جلوكوز)",
                "الأنزيمات",
                "الكلوروفيل",
                "البروتينات"
            ],
            correct: 0
        },
        {
            question: "ما هو اسم العملية التي تحوّل فيها النباتات ضوء الشمس إلى طاقة كيميائية؟",
            answers: [
                "التحلل المائي",
                "التنفس الخلوي",
                "البناء الضوئي",
                "التمثيل الغذائي"
            ],
            correct: 2
        },
        {
            question: "أي من التالي يُعد ضرورياً لامتصاص الماء من التربة في جذور النبات؟",
            answers: [
                "الجذور الشعرية",
                "اللحاء",
                "الأنسجة الميتة",
                "القشر"
            ],
            correct: 0
        },
        {
            question: "أي من العناصر التالية مهم جداً لتكوين البروتينات في النبات؟",
            answers: [
                "الحديد (Fe)",
                "النيتروجين (N)",
                "الماغنيسيوم (Mg)",
                "الكلورين (Cl)"
            ],
            correct: 1
        }
    ],
    en: [
        {
            question: "What is the main chemical element that helps in leaf growth and photosynthesis?",
            answers: [
                "Potassium (K)",
                "Nitrogen (N)",
                "Phosphorus (P)",
                "Calcium (Ca)"
            ],
            correct: 1
        },
        {
            question: "Which of the following is a primary energy source in plant cells?",
            answers: [
                "Sugars (glucose)",
                "Enzymes",
                "Chlorophyll",
                "Proteins"
            ],
            correct: 0
        },
        {
            question: "What is the name of the process by which plants convert sunlight into chemical energy?",
            answers: [
                "Hydrolysis",
                "Cellular respiration",
                "Photosynthesis",
                "Metabolism"
            ],
            correct: 2
        },
        {
            question: "Which structure is essential for water uptake from soil in plant roots?",
            answers: [
                "Root hairs",
                "Phloem",
                "Dead tissues",
                "Periderm"
            ],
            correct: 0
        },
        {
            question: "Which element is crucial for protein synthesis in plants?",
            answers: [
                "Iron (Fe)",
                "Nitrogen (N)",
                "Magnesium (Mg)",
                "Chlorine (Cl)"
            ],
            correct: 1
        }
    ]
};

function applyHtmlLang(lang) {
    const html = document.documentElement;
    if (lang === 'ar') {
        html.setAttribute('lang', 'ar');
        html.setAttribute('dir', 'rtl');
    } else {
        html.setAttribute('lang', 'en');
        html.setAttribute('dir', 'ltr');
    }
}

function setLanguage(lang) {
    currentLanguage = (lang === 'en') ? 'en' : 'ar';
    try {
        localStorage.setItem(LANG_KEY, currentLanguage);
    } catch (e) {
        console.warn('localStorage not available:', e);
    }
    applyHtmlLang(currentLanguage);
    updatePageText();
}

function toggleLanguage() {
    const html = document.documentElement;
    const currentLang = html.getAttribute('lang') || currentLanguage;
    
    if (currentLang === 'ar') {
        setLanguage('en');
    } else {
        setLanguage('ar');
    }
}

function updatePageText() {
    const elements = document.querySelectorAll('[data-ar]');
    elements.forEach(element => {
        const arText = element.getAttribute('data-ar') || '';
        const enText = element.getAttribute('data-en') || '';
        
        if (currentLanguage === 'ar') {
            element.textContent = arText;
        } else {
            element.textContent = enText;
        }
    });

}

function startQuiz() {
    document.getElementById('quizIntro').style.display = 'none';
    document.getElementById('quizContent').style.display = 'block';
    currentQuestion = 0;
    score = 0;
    selectedAnswer = null;
    showQuestion();
}

function showQuestion() {
    const question = questions[currentLanguage][currentQuestion];
    const progressBar = document.getElementById('progressBar');
    const questionCounter = document.getElementById('questionCounter');
    const questionText = document.getElementById('questionText');
    const answersList = document.getElementById('answersList');
    const nextBtn = document.getElementById('nextBtn');
    
    progressBar.style.width = ((currentQuestion + 1) / questions[currentLanguage].length * 100) + '%';
    
    questionCounter.textContent = `${currentQuestion + 1} / ${questions[currentLanguage].length}`;
    questionText.textContent = question.question;
    
    answersList.innerHTML = '';
    question.answers.forEach((answer, index) => {
        const answerDiv = document.createElement('div');
        answerDiv.className = 'answer-option';
        answerDiv.textContent = answer;
        answerDiv.onclick = () => selectAnswer(index);
        answersList.appendChild(answerDiv);
    });
    
    selectedAnswer = null;
    nextBtn.style.display = 'none';
}

function selectAnswer(index) {
    if (selectedAnswer !== null) return;
    
    selectedAnswer = index;
    const question = questions[currentLanguage][currentQuestion];
    const answerOptions = document.querySelectorAll('.answer-option');
    
    answerOptions.forEach((option, i) => {
        option.classList.add('disabled');
        if (i === question.correct) {
            option.classList.add('correct');
        } else if (i === selectedAnswer) {
            option.classList.add('wrong');
        }
    });
    
    if (selectedAnswer === question.correct) {
        score++;
    }
    
    document.getElementById('nextBtn').style.display = 'block';
}

function nextQuestion() {
    currentQuestion++;
    
    if (currentQuestion < questions[currentLanguage].length) {
        showQuestion();
    } else {
        showResult();
    }
}

function showResult() {
    document.getElementById('quizContent').style.display = 'none';
    document.getElementById('quizResult').style.display = 'block';
    
    const resultIcon = document.getElementById('resultIcon');
    const resultTitle = document.getElementById('resultTitle');
    const resultScore = document.getElementById('resultScore');
    const resultMessage = document.getElementById('resultMessage');
    
    const percentage = (score / questions[currentLanguage].length) * 100;
    
    if (currentLanguage === 'ar') {
        resultScore.textContent = `لقد حصلت على ${score} من ${questions[currentLanguage].length}`;
        
        if (percentage === 100) {
            resultIcon.innerHTML = '<i class="fas fa-trophy"></i>';
            resultTitle.textContent = 'ممتاز!';
            resultMessage.textContent = 'أحسنت! لديك معرفة رائعة في علوم الزراعة!';
        } else if (percentage >= 60) {
            resultIcon.innerHTML = '<i class="fas fa-star"></i>';
            resultTitle.textContent = 'رائع!';
            resultMessage.textContent = 'عمل جيد! لديك معرفة جيدة في المجال.';
        } else {
            resultIcon.innerHTML = '<i class="fas fa-book-reader"></i>';
            resultTitle.textContent = 'حاول مرة أخرى!';
            resultMessage.textContent = 'تحتاج لمزيد من التعلم. راجع المحتوى وحاول مرة أخرى!';
        }
    } else {
        resultScore.textContent = `You got ${score} out of ${questions[currentLanguage].length}`;
        
        if (percentage === 100) {
            resultIcon.innerHTML = '<i class="fas fa-trophy"></i>';
            resultTitle.textContent = 'Excellent!';
            resultMessage.textContent = 'Well done! You have great knowledge in agricultural sciences!';
        } else if (percentage >= 60) {
            resultIcon.innerHTML = '<i class="fas fa-star"></i>';
            resultTitle.textContent = 'Great!';
            resultMessage.textContent = 'Good job! You have good knowledge in the field.';
        } else {
            resultIcon.innerHTML = '<i class="fas fa-book-reader"></i>';
            resultTitle.textContent = 'Try Again!';
            resultMessage.textContent = 'You need more learning. Review the content and try again!';
        }
    }
}

function restartQuiz() {
    document.getElementById('quizResult').style.display = 'none';
    document.getElementById('quizIntro').style.display = 'block';
    currentQuestion = 0;
    score = 0;
    selectedAnswer = null;
}

window.addEventListener('load', () => {
    try {
        const saved = localStorage.getItem(LANG_KEY);
        if (saved === 'en' || saved === 'ar') {
            currentLanguage = saved;
        } else {
            currentLanguage = 'ar'; 
        }
    } catch (e) {
        console.warn('localStorage not available:', e);
        currentLanguage = 'ar';
    }

    applyHtmlLang(currentLanguage);
    updatePageText();

    document.querySelectorAll('[data-lang]').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const chosen = this.getAttribute('data-lang');
            setLanguage(chosen);
        });
    });

    const toggleBtn = document.getElementById('lang-toggle');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            toggleLanguage();
        });
    }
});