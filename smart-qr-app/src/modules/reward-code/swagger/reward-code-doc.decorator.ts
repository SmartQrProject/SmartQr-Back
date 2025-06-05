import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { CreateRewardCodeDto } from '../dto/create-reward-code.dto';
import { RewardCode } from 'src/shared/entities/reward-code.entity';

// Param for identifying the restaurant
const SlugParam = ApiParam({
  name: 'slug',
  description: 'Unique restaurant identifier',
  example: 'eli-cafe',
  required: true,
});

// Param for identifying the reward code
const IdParam = ApiParam({
  name: 'id',
  description: 'Reward Code ID',
  example: 'd504d61a-02ad-4b28-957d-ac1b2f52bf48',
  required: true,
});

export function CreateRewardCodeDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    SlugParam,
    ApiOperation({ summary: 'Create a new reward code' }),
    ApiBody({
      type: CreateRewardCodeDto,
      examples: {
        discount10: {
          summary: '10% Discount Code',
          value: {
            code: 'SAVE10',
            percentage: 10,
          },
        },
        discount20: {
          summary: '20% Discount Code',
          value: {
            code: 'SAVE20',
            percentage: 20,
          },
        },
      },
    }),
    ApiResponse({
      status: 201,
      description: 'Reward code created successfully',
      schema: {
        example: {
          RewardCode: {
            id: 'd504d61a-02ad-4b28-957d-ac1b2f52bf48',
            code: 'Q8T4FMEE62',
            percentage: 10,
          },
        },
      },
    }),
    //ApiResponse({ status: 400, description: 'Invalid data or duplicate code' }),
    ApiResponse({ status: 404, description: '❌ Restaurant with slug "xxx-cafe" not found' }),
  );
}

export function GetAllRewardCodesDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    SlugParam,
    ApiOperation({ summary: 'List all reward codes for an specific restaurant' }),
    ApiResponse({
      status: 200,
      description: 'List of all reward codes for an specific restaurant',
      schema: {
        example: {
          RewardCode: [
            {
              id: 'd504d61a-02ad-4b28-957d-ac1b2f52bf48',
              code: 'Q8T4FMEE62',
              isActive: true,
              percentage: 10,
              created_at: '2025-06-04T06:44:06.653Z',
              restaurant: {
                slug: 'eli-cafe',
              },
              exist: true,
            },
            {
              id: 'ca805624-d34b-4c59-bf62-cd93fc43d13c',
              code: 'EMUKB28UX5',
              isActive: true,
              percentage: 10,
              created_at: '2025-06-04T07:00:09.698Z',
              restaurant: {
                slug: 'eli-cafe',
              },
              exist: true,
            },
          ],
        },
      },
    }),
  );
}

export function GetRewardCodeByIdDoc() {
  return applyDecorators(
    SlugParam,
    IdParam,
    ApiOperation({ summary: 'Get reward code by ID' }),
    ApiResponse({ status: 200, description: 'Reward code found' }),
    ApiResponse({ status: 404, description: 'Reward code not found' }),
  );
}

export function UpdateRewardCodeDoc() {
  return applyDecorators(
    SlugParam,
    IdParam,
    ApiOperation({ summary: 'Update reward code by ID' }),
    ApiBody({
      type: CreateRewardCodeDto,
      description: 'Partial or full update of an existing reward code. You can send one or more fields to update.',
      examples: {
        updatePercentageOnly: {
          summary: 'Update only the discount percentage',
          value: {
            percentage: 20,
          },
        },
        fullUpdate: {
          summary: 'Update code and percentage',
          value: {
            code: 'SUMMER20',
            percentage: 20,
          },
        },
      },
    }),
    ApiResponse({ status: 200, description: 'Reward code updated successfully' }),
    ApiResponse({ status: 404, description: 'Reward code not found' }),
  );
}

export function DeleteRewardCodeDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    SlugParam,
    IdParam,
    ApiOperation({ summary: 'RewardCode to be logically deleted' }),
    ApiResponse({ status: 200, description: 'RewardCode logically deleted', example: '5S8RWK42F7' }),
    ApiResponse({
      status: 404,
      description: 'Reward code not found',
      schema: {
        example: {
          message: "Code not found or does not belong to restaurant with slug 'eli-cafe1'",
          error: 'Not Found',
          statusCode: 404,
        },
      },
    }),
  );
}

export function GetRewardCodeByCodeDoc() {
  return applyDecorators(
    SlugParam,
    ApiOperation({ summary: 'Get reward code by ID' }),
    ApiResponse({
      status: 200,
      description: 'Reward code found',
      schema: {
        example: {
          RewardCode: {
            id: 'c1c1a06b-3c84-47cc-8f80-519a8a3f3075',
            code: '5S8RWK42F7',
            isActive: true,
            percentage: 10,
            created_at: '2025-06-04T06:44:37.353Z',
            restaurant: {
              id: '531a7844-b425-4f90-b161-a78ce748f977',
              name: 'Eli Cafe',
              slug: 'eli-cafe',
              owner_email: 'elicafe@gmail.com',
              is_active: true,
              created_at: '2025-06-03T19:17:15.683Z',
              subscription: {
                id: '35f56dbe-73b3-4fc8-89b5-99d6585425b6',
                stripeSubscriptionId: 'sub_1RVxWnGhU7wXEtY4yJQHdnyE',
                customerId: 'cus_SQpBnIgrbz4Sfu',
                status: 'active',
                plan: 'price_1RNXoLGhU7wXEtY4Htr33Caa',
                currentPeriodEnd: '2025-06-03T19:17:27.000Z',
                createdAt: '2025-06-03T19:17:41.981Z',
                exist: true,
                isTrial: false,
                cancelAtPeriodEnd: false,
              },
              exist: true,
              banner: 'https://res.cloudinary.com/dsrcokjsp/image/upload/v1748967499/banners/ftedtdxgpdvzjeru1xcf.jpg',
              address: 'Canada Boulevard, Toronto, Ontario M6K 3C3, Canada',
              phone: null,
              description: 'Authentic Colombian coffee, artisan pastries, and a warm, cozy atmosphere — your perfect coffee break starts here.',
              tags: ['Coffee Specialties', 'Breakfast & Brunch'],
              trading_hours: {
                sunday: {
                  open: '09:00',
                  close: '17:00',
                },
                saturday: {
                  open: '09:00',
                  close: '17:00',
                },
              },
              ordering_times: null,
              latitude: '43.634871',
              longitude: '-79.409834',
              wasTrial: false,
            },
            exist: true,
          },
        },
      },
    }),
    ApiResponse({ status: 404, description: 'Reward code not found' }),
    ApiResponse({ status: 404, description: '❌ Restaurant with slug "xxx" not found' }),
  );
}
