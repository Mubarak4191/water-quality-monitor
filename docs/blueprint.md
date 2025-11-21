# **App Name**: Water Quality Monitor

## Core Features:

- BLE Device Pairing: Pair with ESP32-based water quality sensors via Bluetooth Low Energy. Maintain a persistent connection for data streaming.
- Real-time Data Dashboard: Display pH, Temperature, TDS, and Turbidity readings in real-time using interactive charts. Alert user when values exceed safe thresholds, where safe thresholds can be configured in the settings
- Historical Data Analysis: Store and visualize historical data (24H, 7D, 30D) with zoom/pan capabilities on charts.
- Alerts and Notifications: Configure custom alerts for specific sensor readings (e.g., high pH). Receive push notifications and/or emails when thresholds are breached. The LLM decides, based on user settings and sensor readings, if any of these communication methods is the most appropriate tool.
- User Account Management: Secure user registration, login, and profile management with token-based authentication.
- Data Export: Export historical data in CSV format for further analysis.
- Settings and Configuration: Configure device settings, notification preferences, and user profile information.

## Style Guidelines:

- Primary color: Dark forest green (#306754) to reflect the water and nature aspect of the app.
- Background color: Very light desaturated green (#F0F4F2), creating a calming backdrop.
- Accent color: Yellow-Orange (#D68910) for notifications, warnings, and actionable items.
- Body and headline font: 'PT Sans', a humanist sans-serif with both modern and warm features for headlines and body.
- Use minimalist line icons representing water quality parameters, device connection status, and alerts.
- Employ a clean, intuitive layout with tab-based navigation for dashboard, history, and settings. Utilize cards to display individual sensor readings and alerts.
- Implement subtle animations for data updates, loading states, and transitions between screens to enhance user engagement.