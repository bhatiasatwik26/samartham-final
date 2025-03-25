import { Leaderboards } from "@/types/user";

export const fetchLeaderboardData = async (): Promise<Leaderboards[]> => {
  const response = await fetch("http://localhost:3000/api/user/leaderboard", {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch leaderboard data");
  }

  const data = await response.json();
  console.log("Leaderboard Data:", data);

  const leaderboard: Leaderboards[] = data.map((person: any) => ({
    position: person.position,
    name: person.name,
    score: person.score,
    rank: person.rank,
  }));
  console.log(leaderboard);

  return leaderboard;
};
