import { Neighbourhood } from "../types/neighbourhood";

const LIKES_KEY = "vibeloc_likes";
const DISLIKES_KEY = "vibeloc_dislikes";

export class SwipeStorage {
  private actor: any;
  private isAuthenticated: boolean;

  constructor(actor: any, isAuthenticated: boolean) {
    this.actor = actor;
    this.isAuthenticated = isAuthenticated;
  }

  async getLikedIds(): Promise<number[]> {
    if (this.isAuthenticated && this.actor) {
      try {
        const items = await this.actor.getShortlistedNeighbourhoods();
        return items.map((item: any) => Number(item.neighbourhoodId));
      } catch (error) {
        console.error("Error fetching shortlist:", error);
        return this.getLocalLikes();
      }
    }
    return this.getLocalLikes();
  }

  async addLike(neighbourhoodId: number): Promise<void> {
    const likes = this.getLocalLikes();
    if (!likes.includes(neighbourhoodId)) {
      likes.push(neighbourhoodId);
      localStorage.setItem(LIKES_KEY, JSON.stringify(likes));
    }

    if (this.isAuthenticated && this.actor) {
      try {
        await this.actor.shortlistNeighbourhood(BigInt(neighbourhoodId));
      } catch (error) {
        console.error("Error adding to shortlist:", error);
      }
    }
  }

  async removeLike(neighbourhoodId: number): Promise<void> {
    const likes = this.getLocalLikes().filter((id) => id !== neighbourhoodId);
    localStorage.setItem(LIKES_KEY, JSON.stringify(likes));

    if (this.isAuthenticated && this.actor) {
      try {
        await this.actor.removeFromShortlist(BigInt(neighbourhoodId));
      } catch (error) {
        console.error("Error removing from shortlist:", error);
      }
    }
  }

  getDislikedIds(): number[] {
    const stored = localStorage.getItem(DISLIKES_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  addDislike(neighbourhoodId: number): void {
    const dislikes = this.getDislikedIds();
    if (!dislikes.includes(neighbourhoodId)) {
      dislikes.push(neighbourhoodId);
      localStorage.setItem(DISLIKES_KEY, JSON.stringify(dislikes));
    }
  }

  async clearAll(): Promise<void> {
    localStorage.removeItem(LIKES_KEY);
    localStorage.removeItem(DISLIKES_KEY);

    if (this.isAuthenticated && this.actor) {
      try {
        await this.actor.clearShortlist();
      } catch (error) {
        console.error("Error clearing shortlist:", error);
      }
    }
  }

  private getLocalLikes(): number[] {
    const stored = localStorage.getItem(LIKES_KEY);
    return stored ? JSON.parse(stored) : [];
  }
}
