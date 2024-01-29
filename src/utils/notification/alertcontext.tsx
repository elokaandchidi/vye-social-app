// AlertContext.tsx
import React, { createContext, useContext, ReactNode, ReactElement } from 'react';

// Define the alert type
type Alert = {
  message: string;
  type: 'success' | 'error' | 'info';
};

type AlertContextType = {
  alerts: Alert[];
  addAlert: (alert: Alert) => void;
  clearAlert: () => void;
};

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export function AlertProvider({ children }: { children: ReactNode }): ReactElement {
  const [alerts, setAlerts] = React.useState<Alert[]>([]);

  const addAlert = (alert: Alert) => {
    setAlerts([...alerts, alert]);
    setTimeout(() => {
        clearAlert()
    }, 5000);
  };

  const clearAlert = () => {
    setAlerts([]);
  };

  return (
    <AlertContext.Provider value={{ alerts, addAlert, clearAlert }}>
      {children}
    </AlertContext.Provider>
  );
}

export function  useAlert() {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
}
