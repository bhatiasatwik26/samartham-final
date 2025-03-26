/**
 * Represents a single day of activity in the heatmap calendar
 */
export interface ActivityDay {
  /**
   * ISO date string in YYYY-MM-DD format
   */
  date: string;
  
  /**
   * Activity count/intensity for the day (0-4)
   * 0 = No activity
   * 1 = Low activity
   * 2 = Medium activity
   * 3 = High activity
   * 4 = Very high activity
   */
  count: number;
} 