export interface User {
	rank?: number,
	image: string,
	username: string,
	millies: number,
	interests: string[],
	millies_this_quest?: number,
	puzzles?: number,
	keys?: number,
	items?: string[]
}