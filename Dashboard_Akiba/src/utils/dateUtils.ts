/**
 * Formats an ISO date string to a more readable format (DD/MM/YYYY HH:mm)
 * @param dateString ISO date string
 * @returns Formatted date string or a placeholder if null/undefined
 */
export const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return "—--------";
  
  try {
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) return dateString;
    
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(date).replace(',', '');
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString;
  }
};
