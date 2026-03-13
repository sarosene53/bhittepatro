# Bhittepatro (Nepali Calendar)

A modern, responsive, and beautiful Nepali Calendar (Bikram Sambat) web application built with HTML, CSS, and vanilla JavaScript. 

[Click here to visit the site] (https://sarosene53.github.io/bhittepatro/)

## Features

- **Accurate Date Engine**: Powered by the `nepali-date-converter` library to ensure accurate BS (Bikram Sambat) to AD (Anno Domini) conversions.
- **Lunar Data Integration**: Dynamically calculates and displays daily Tithis (Lunar days, e.g., Purnima, Amavasya) and accurately places Moon phase emojis.
- **Dynamic Holiday Support**: Includes built-in support for both static BS holidays (like Nepali New Year) and dynamic lunar-based holidays (like Dashain, Tihar, Shivaratri, Holi).
- **Dual Language**: Seamlessly toggle the entire interface between Nepali and English, including numbers, holidays, months, and weekdays.
- **Premium Aesthetics**: Features a sleek, modern "Premium Blue" and "Dark Slate" color palette. The design is meticulously crafted to be fully responsive on mobile devices securely and responsively.
- **Export to Image**: Quickly save the current calendar view as a high-resolution PNG image directly to your device with the "Save Image" button.

## How to Run Locally

This is a static web application, meaning no complex build steps or databases are required! 

1. **Clone or Download the Repository**
2. **Open the `index.html` File**
   Depending on your environment, you can simply double-click the `index.html` file to open it directly in your browser.
3. **Run a Local Server (Recommended for Export Features)**
   To fully utilize the "Save Image" feature (which relies on `html2canvas`), it is highly recommended to serve the folder over a local HTTP server to avoid local CORS restrictions in the browser.
   
   If you have Python installed, you can easily start a server:
   ```bash
   # Open your terminal in the project directory
   cd path/to/nepali-calendar
   
   # Start a Python HTTP server
   python3 -m http.server 8000
   ```
   Then navigate to `http://localhost:8000` in your web browser.

## Technologies Used

- **HTML5** & **CSS3**: For structure, responsive layout, and custom modern styling.
- **Vanilla JavaScript**: For UI logic, date calculations, and DOM manipulation.
- **[nepali-date-converter](https://github.com/techgaun/nepali-date-converter)**: An excellent, lightweight library utilized for core calendar mathematics.
- **[html2canvas](https://html2canvas.hertzen.com/)**: Enables the canvas-based exporting of the DOM into a downloadable image.
