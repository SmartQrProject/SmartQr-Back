export class RestaurantMiniDto {
  name: string;
  slug: string;
}

export class CustomerResponseDto {
  id: string;
  auth0Id: string;
  email?: string;
  name?: string;
  picture?: string;
  reward: number;
  last_visit?: Date;
  visits_count: number;
  created_at: Date;
  modified_at: Date;
  restaurant: RestaurantMiniDto;
  exist: boolean;
}
