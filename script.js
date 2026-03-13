document.addEventListener('DOMContentLoaded', () => {

    // Elements
    const bsMonthSelectEl = document.getElementById('bs-month-select');
    const bsYearSelectEl = document.getElementById('bs-year-select');
    const adMonthsSpanEl = document.getElementById('ad-months-span');
    const calendarGridEl = document.getElementById('calendar-grid');

    const prevBtn = document.getElementById('prev-month');
    const nextBtn = document.getElementById('next-month');
    const todayBtn = document.getElementById('jump-today');

    // Dependencies
    let NepaliDateClass = null;

    // Constants & Translations
    const TRANSLATIONS = {
        en: {
            bsMonths: ["Baisakh", "Jestha", "Asar", "Shrawan", "Bhadra", "Aswin", "Kartik", "Mangsir", "Poush", "Magh", "Falgun", "Chaitra"],
            adMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            weekdays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            tithiNames: [
                "Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami", "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami",
                "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Purnima",
                "Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami", "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami",
                "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Amavasya"
            ],
            todayBtn: "Jump to Today",
            langBtn: "🔤 EN"
        },
        ne: {
            bsMonths: ["वैशाख", "जेठ", "असार", "साउन", "भदौ", "असोज", "कात्तिक", "मंसिर", "पुस", "माघ", "फागुन", "चैत"],
            adMonths: ["जनवरी", "फेब्रुअरी", "मार्च", "अप्रिल", "मे", "जुन", "जुलाई", "अगस्ट", "सेप्टेम्बर", "अक्टोबर", "नोभेम्बर", "डिसेम्बर"],
            weekdays: ["आइत", "सोम", "मंगल", "बुध", "बिही", "शुक्र", "शनि"],
            tithiNames: [
                "प्रतीपदा", "द्वितीया", "तृतीया", "चतुर्थी", "पञ्चमी", "षष्ठी", "सप्तमी", "अष्टमी", "नवमी", "दशमी",
                "एकादशी", "द्वादशी", "त्रयोदशी", "चतुर्दशी", "पूर्णिमा",
                "प्रतीपदा", "द्वितीया", "तृतीया", "चतुर्थी", "पञ्चमी", "षष्ठी", "सप्तमी", "अष्टमी", "नवमी", "दशमी",
                "एकादशी", "द्वादशी", "त्रयोदशी", "चतुर्दशी", "औंसी"
            ],
            todayBtn: "आज जानुहोस्",
            langBtn: "🔤 NE"
        }
    };

    // Holiday Mappings (Translations handled inside render)
    // Key: {monthIndex}-{date} (0-indexed month)
    const STATIC_BS_HOLIDAYS = {
        "0-1": { en: "Nepali New Year", ne: "नयाँ वर्ष" },
        "0-11": { en: "Loktantra Diwas", ne: "लोकतन्त्र दिवस" },
        "1-15": { en: "Ganatantra Diwas", ne: "गणतन्त्र दिवस" },
        "5-3": { en: "Constitution Day", ne: "संविधान दिवस" },
        "10-7": { en: "Prajatantra Diwas", ne: "प्रजातन्त्र दिवस" },
    };

    // Key: {monthIndex}-{tithiIndex} (0-indexed)
    // Dashain is generally in Ashwin (5) Shukla Paksha
    // Tihar is generally in Kartik (6) Krishna/Shukla Paksha
    const LUNAR_HOLIDAYS = {
        "5-6": { en: "Fulpati", ne: "फूलपाती" },
        "5-7": { en: "Maha Ashtami", ne: "महाअष्टमी" },
        "5-8": { en: "Maha Navami", ne: "महानवमी" },
        "5-9": { en: "Vijaya Dashami", ne: "विजया दशमी" },
        "6-29": { en: "Laxmi Puja", ne: "लक्ष्मी पूजा" },
        "6-0": { en: "Mha Puja", ne: "म्ह पूजा" },
        "6-1": { en: "Bhai Tika", ne: "भाइटीका" },
        "9-4": { en: "Saraswati Puja", ne: "सरस्वती पूजा" }, // Magh Shukla Panchami
        "10-28": { en: "Maha Shivaratri", ne: "महाशिवरात्रि" }, // Falgun Krishna Chaturdashi
        "10-14": { en: "Holi Purnima", ne: "होली पूर्णिमा" } // Falgun Purnima
    };

    // State Variables
    let currentLang = 'en'; // 'en' or 'ne'
    let currentTheme = 'light'; // Default is light in CSS

    let currentBsYear = 0;
    let currentBsMonthIndex = 0; // 0-11

    let todayBsYear = 0;
    let todayBsMonthIndex = 0;
    let todayBsDate = 0;

    // Initialization
    function init() {
        NepaliDateClass = window.NepaliDate ? (window.NepaliDate.default || window.NepaliDate) : null;
        if (!NepaliDateClass) {
            bsMonthSelectEl.innerHTML = '<option>Error</option>';
            return;
        }

        const today = new NepaliDateClass();
        todayBsYear = today.getYear();
        todayBsMonthIndex = today.getMonth(); // returns 0-11
        todayBsDate = today.getDate();

        // Set initial view to today's month
        currentBsYear = todayBsYear;
        currentBsMonthIndex = todayBsMonthIndex;

        populateSelectors();
        renderCalendar();
    }

    // Setup Dropdowns
    function populateSelectors() {
        const t = TRANSLATIONS[currentLang];

        // Populate Months
        bsMonthSelectEl.innerHTML = '';
        t.bsMonths.forEach((monthName, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = monthName;
            bsMonthSelectEl.appendChild(option);
        });

        // Populate Years (e.g., 1970 to 2100)
        bsYearSelectEl.innerHTML = '';
        const startYear = 1970;
        const endYear = 2100;
        for (let y = startYear; y <= endYear; y++) {
            const option = document.createElement('option');
            option.value = y;
            option.textContent = convertToNepaliNumber(y);
            bsYearSelectEl.appendChild(option);
        }
    }

    // ----- LUNAR PHASE UTILS ----- //

    // ----- LUNAR PHASE UTILS ----- //

    const MOON_ICONS = [
        "🌑", // New Moon (Amavasya)
        "🌒", // Waxing Crescent
        "🌓", // First Quarter
        "🌔", // Waxing Gibbous
        "🌕", // Full Moon (Purnima)
        "🌖", // Waning Gibbous
        "🌗", // Last Quarter
        "🌘"  // Waning Crescent
    ];

    /**
     * Calculates the approximate lunar age (0 to 29.53) for a given JS Date.
     * 0 = New Moon, ~14.76 = Full Moon.
     */
    function getLunarAge(date) {
        // A known new moon reference date (e.g., Jan 11, 2024, ~11:57 UTC)
        const referenceNewMoon = new Date(Date.UTC(2024, 0, 11, 11, 57, 0)).getTime();
        const lunarCycle = 29.53058867 * 24 * 60 * 60 * 1000; // ms in a lunar month

        // Normalize target date to noon to avoid extreme edge case jumping during the day
        const targetDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0).getTime();

        let diff = targetDate - referenceNewMoon;
        let ageMs = diff % lunarCycle;
        if (ageMs < 0) ageMs += lunarCycle; // Handle dates before reference

        return ageMs / (24 * 60 * 60 * 1000); // return age in days
    }

    function getLunarDetails(date) {
        const age = getLunarAge(date);

        // 1. Determine Tithi (0-29 index)
        // 30 tithis in a 29.53 day cycle.
        let tithiIndex = Math.floor((age / 29.53058867) * 30);
        if (tithiIndex >= 30) tithiIndex = 29;

        // 2. Determine Moon Icon (8 phases)
        // Split the 29.53 days into 8 segments
        let phaseIndex = Math.round((age / 29.53058867) * 8) % 8;

        return {
            tithiIndex: tithiIndex,
            moonIcon: MOON_ICONS[phaseIndex]
        };
    }

    // Number conversion utility
    function convertToNepaliNumber(num) {
        if (currentLang === 'en') return num;
        const nepaliDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
        return num.toString().split('').map(digit => nepaliDigits[parseInt(digit)] || digit).join('');
    }

    // Render Calendar matrix
    function renderCalendar() {
        if (!NepaliDateClass) return;

        // Clear grid
        calendarGridEl.innerHTML = '';

        // Safely extract the number of days in the month using the exposed config, or fallback to an instance
        let daysInMonth = 30; // fallback safety
        try {
            // Because nepaliDate.dateConfigMap is an object in the UMD bundle but we need a reliable way.
            // A foolproof way is using string lookup if window.NepaliDate.dateConfigMap exists:
            if (window.NepaliDate.dateConfigMap && window.NepaliDate.dateConfigMap[currentBsYear]) {
                // Config map keys are usually in English
                const englishMonthArr = ["Baisakh", "Jestha", "Asar", "Shrawan", "Bhadra", "Aswin", "Kartik", "Mangsir", "Poush", "Magh", "Falgun", "Chaitra"];
                daysInMonth = window.NepaliDate.dateConfigMap[currentBsYear][englishMonthArr[currentBsMonthIndex]];
            }
        } catch (e) { }

        // Get the day of the week the 1st of the month falls on
        const firstDayObj = new NepaliDateClass(currentBsYear, currentBsMonthIndex, 1);
        const startingDayOfWeek = firstDayObj.getDay(); // 0 is Sunday, 6 is Saturday

        // Calculate AD months overlap (1st day and last day of the BS month)
        const firstAdObj = firstDayObj.getAD();
        const lastDayObj = new NepaliDateClass(currentBsYear, currentBsMonthIndex, daysInMonth);
        const lastAdObj = lastDayObj.getAD();

        // Update Headers & Labels based on Language
        const t = TRANSLATIONS[currentLang];

        // Update Weekdays Header
        const weekdaysHeaderList = document.querySelectorAll('#weekdays-header div');
        weekdaysHeaderList.forEach(div => {
            const dayIdx = div.getAttribute('data-day');
            if (dayIdx !== null) {
                div.textContent = t.weekdays[dayIdx];
            }
        });

        // Update Buttons
        todayBtn.textContent = t.todayBtn;
        document.getElementById('toggle-lang').textContent = t.langBtn;

        // Sync Select Dropdowns
        bsMonthSelectEl.value = currentBsMonthIndex;
        bsYearSelectEl.value = currentBsYear;

        // Re-populate month/year texts if language changed (we can just re-populate quickly)
        populateSelectors();
        bsMonthSelectEl.value = currentBsMonthIndex;
        bsYearSelectEl.value = currentBsYear;

        // Fix: getAD().month is 0-indexed (0=Jan, 11=Dec). We don't need to do -1 here.
        if (firstAdObj.month === lastAdObj.month) {
            adMonthsSpanEl.textContent = `${t.adMonths[firstAdObj.month]} ${firstAdObj.year}`;
        } else {
            let yearStr = firstAdObj.year === lastAdObj.year ? `${firstAdObj.year}` : `${firstAdObj.year} / ${lastAdObj.year}`;
            adMonthsSpanEl.textContent = `${t.adMonths[firstAdObj.month]} / ${t.adMonths[lastAdObj.month]} ${yearStr}`;
        }


        // Generate blank cells for offset
        for (let i = 0; i < startingDayOfWeek; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.className = 'date-cell empty-cell';
            calendarGridEl.appendChild(emptyCell);
        }

        // Generate date cells
        for (let d = 1; d <= daysInMonth; d++) {
            const cell = document.createElement('div');
            cell.className = 'date-cell cell-anim';
            // Stagger animation
            cell.style.animationDelay = `${(d * 0.01)}s`;

            // Calculate AD info for this specific day
            const currentBsObj = new NepaliDateClass(currentBsYear, currentBsMonthIndex, d);
            const currentAdObj = currentBsObj.getAD();
            const dayOfWeek = currentBsObj.getDay();

            // Highlight Today
            if (currentBsYear === todayBsYear && currentBsMonthIndex === todayBsMonthIndex && d === todayBsDate) {
                cell.classList.add('today');
            }

            // Highlight Weekend (Saturday is 6. In Nepal, Saturdays are holidays)
            if (dayOfWeek === 6) {
                cell.classList.add('weekend');
            }

            // Build payload
            const bsNum = document.createElement('div');
            bsNum.className = 'bs-date-num';
            bsNum.textContent = convertToNepaliNumber(d);

            const adNum = document.createElement('div');
            adNum.className = 'ad-date-num';
            adNum.textContent = currentAdObj.date;

            // Calculate and add Lunar Details
            // currentAdObj.month from nepali-date-converter is already 0-indexed (0=Jan, 11=Dec)
            const adDateObj = new Date(currentAdObj.year, currentAdObj.month, currentAdObj.date);
            const lunarDetails = getLunarDetails(adDateObj);

            const tithiEl = document.createElement('div');
            tithiEl.className = 'tithi-name';
            tithiEl.textContent = t.tithiNames[lunarDetails.tithiIndex];

            const moonEl = document.createElement('div');
            moonEl.className = 'moon-phase';
            moonEl.textContent = lunarDetails.moonIcon;

            cell.appendChild(bsNum);
            cell.appendChild(adNum);
            cell.appendChild(tithiEl);
            cell.appendChild(moonEl);

            // Check for Holidays
            let holidayName = null;

            // 1. Static BS Holidays
            const bsKey = `${currentBsMonthIndex}-${d}`;
            if (STATIC_BS_HOLIDAYS[bsKey]) {
                holidayName = STATIC_BS_HOLIDAYS[bsKey][currentLang];
            }

            // 2. Lunar Holidays (Overrides BS if both fall on same day, though rare)
            const lunarKey = `${currentBsMonthIndex}-${lunarDetails.tithiIndex}`;
            if (LUNAR_HOLIDAYS[lunarKey]) {
                holidayName = LUNAR_HOLIDAYS[lunarKey][currentLang];
            }

            if (holidayName) {
                cell.classList.add('holiday');
                const festivalEl = document.createElement('div');
                festivalEl.className = 'festival-name';
                festivalEl.textContent = holidayName;
                festivalEl.title = holidayName; // Tooltip for truncated text
                cell.appendChild(festivalEl);
            }

            calendarGridEl.appendChild(cell);
        }
    }

    // Navigation Controls
    prevBtn.addEventListener('click', () => {
        currentBsMonthIndex--;
        if (currentBsMonthIndex < 0) {
            currentBsMonthIndex = 11;
            currentBsYear--;
        }
        renderCalendar();
    });

    nextBtn.addEventListener('click', () => {
        currentBsMonthIndex++;
        if (currentBsMonthIndex > 11) {
            currentBsMonthIndex = 0;
            currentBsYear++;
        }
        renderCalendar();
    });

    todayBtn.addEventListener('click', () => {
        currentBsYear = todayBsYear;
        currentBsMonthIndex = todayBsMonthIndex;
        renderCalendar();
    });

    bsMonthSelectEl.addEventListener('change', (e) => {
        currentBsMonthIndex = parseInt(e.target.value, 10);
        renderCalendar();
    });

    bsYearSelectEl.addEventListener('change', (e) => {
        currentBsYear = parseInt(e.target.value, 10);
        renderCalendar();
    });

    // Theme & Lang Controls
    const toggleThemeBtn = document.getElementById('toggle-theme');
    toggleThemeBtn.addEventListener('click', () => {
        if (currentTheme === 'dark') {
            currentTheme = 'light';
            document.documentElement.setAttribute('data-theme', 'light');
            toggleThemeBtn.textContent = '🌙 Dark';
        } else {
            currentTheme = 'dark';
            document.documentElement.setAttribute('data-theme', 'dark');
            toggleThemeBtn.textContent = '☀️ Light';
        }
    });

    const toggleLangBtn = document.getElementById('toggle-lang');
    toggleLangBtn.addEventListener('click', () => {
        currentLang = currentLang === 'en' ? 'ne' : 'en';
        renderCalendar(); // Re-render with new language
    });

    // Export Feature
    const exportBtn = document.getElementById('export-btn');
    exportBtn.addEventListener('click', async () => {
        // Find the panel to capture
        const panel = document.querySelector('.paper-panel');
        if (!panel) return;

        // Temporarily adjust styles for better capture if needed
        const originalBg = panel.style.background;
        const originalBoxShadow = panel.style.boxShadow;

        // Solidify the background for the export
        panel.style.background = '#fdfbf7';
        panel.style.boxShadow = 'none';

        exportBtn.textContent = '⏳ Saving...';
        exportBtn.disabled = true;

        try {
            const canvas = await html2canvas(panel, {
                scale: 2, // High resolution
                backgroundColor: '#fdfbf7',
                logging: false,
                useCORS: true
            });

            // Create download link
            const url = canvas.toDataURL('image/png');
            const a = document.createElement('a');

            // Format filename: nepali-calendar-year-month.png
            const t = TRANSLATIONS.en; // pure english filename best practice
            const monthName = t.bsMonths[currentBsMonthIndex].toLowerCase();
            a.download = `nepali-calendar-${currentBsYear}-${monthName}.png`;
            a.href = url;
            a.click();
        } catch (error) {
            console.error('Failed to export calendar', error);
            alert('Failed to save the image. Please try again.');
        } finally {
            // Restore original styles
            panel.style.background = originalBg;
            panel.style.boxShadow = originalBoxShadow;
            exportBtn.textContent = '📸 Save Image';
            exportBtn.disabled = false;
        }
    });

    // Run init
    init();

});
