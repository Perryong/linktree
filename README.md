# Portfolio Website

A modern, responsive portfolio website built with **React**, **TypeScript**, and **Tailwind CSS**. This project showcases a real-time clock widget, custom interactive buttons, and links to your portfolio, LinkedIn, and GitHub profiles. It features a stylish overlay on a background image, smooth transitions, and a clean, modern design.

## Table of Contents
1. [Features](#features)
2. [Project Structure](#project-structure)
3. [Technologies Used](#technologies-used)
4. [Customization](#customization)
5. [License](#license)
6. [Acknowledgements](#acknowledgements)

---

## Features

- **Responsive Design**  
  The layout is fully responsive, ensuring an optimal viewing experience across a wide range of devices using Tailwind CSS.

- **Real-Time Clock Widget**  
  Displays the current time with a clock icon and a white background for clarity.

- **Custom Button Components**  
  Built with Radix UI's Slot API and class variance for reusable and flexible button styling.

- **Interactive Links**  
  Smooth hover transitions for external profiles and portfolio links.

- **Modern Tech Stack**  
  Leveraging React, TypeScript, and Tailwind CSS with additional utility libraries like `class-variance-authority` and `tailwind-merge`.

---

## Project Structure
```
.
├── app.tsx                  # Main application component, including layout and page content.
├── components
│   └── ui
│       └── button.tsx       # Custom Button component with variant and size configurations.
├── lib
│   └── utils.ts             # Utility functions (e.g., class name merging using tailwind-merge).
├── main.tsx                 # Entry point for the React application.
├── index.css                # Global styles and Tailwind CSS configuration.
└── README.md                # Project documentation.
```

## Technologies Used
- **React** – A JavaScript library for building user interfaces.
- **TypeScript** – A strongly typed superset of JavaScript.
- **Tailwind CSS** – A utility-first CSS framework for rapid UI development.
- **Radix UI** – Accessible UI primitives for React applications.
- **Lucide React** – A set of beautifully crafted, open-source icons.
- **Class Variance Authority** – Manages variant-based styling.
- **Tailwind Merge** – Intelligent class merging for Tailwind CSS.

## Customization
You can easily adapt the website to your preferences:

### Clock Widget
Change the background color, icon size, and layout in the `ClockWidget` component.

### Buttons
Update button styles, variants, and sizes in `components/ui/button.tsx` to match your brand or design.

### Overlay & Background
Modify the background image and overlay settings in `app.tsx` and `index.css`.

## License
This project is licensed under the [MIT License](LICENSE). You are free to use, modify, and distribute this software in accordance with the license terms.

## Acknowledgements
- **Artwork**: Background image credited to [@vince19visuals](https://unsplash.com/@vince19visuals).
- **Open Source Libraries**: Thanks to the contributors of the open-source libraries and tools used in this project.
