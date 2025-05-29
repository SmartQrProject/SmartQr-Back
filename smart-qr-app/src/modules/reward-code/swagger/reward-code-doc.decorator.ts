import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiBody } from '@nestjs/swagger';
import { CreateRewardCodeDto } from '../dto/create-reward-code.dto';

const SlugParam = ApiParam({
  name: 'slug',
  description: 'Unique restaurant identifier',
  example: 'test-cafe',
  required: true,
});

const IdParam = ApiParam({
  name: 'id',
  description: 'Reward Code ID',
  example: 'c2917676-d3d2-472a-8b7c-785f455a80ab',
  required: true,
});

const ApiNotFound = ApiResponse({ status: 404, description: 'Reward code not found' });

export function CreateRewardCodeDoc() {
  return applyDecorators(
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
      },
    }),
    ApiResponse({ status: 201, description: 'Reward code created successfully' }),
    ApiResponse({ status: 400, description: 'Invalid data or duplicate code' }),
  );
}

export function GetAllRewardCodesDoc() {
  return applyDecorators(SlugParam, ApiOperation({ summary: 'List all reward codes' }), ApiResponse({ status: 200, description: 'List of reward codes' }));
}

export function GetRewardCodeByIdDoc() {
  return applyDecorators(SlugParam, IdParam, ApiOperation({ summary: 'Get reward code by ID' }), ApiResponse({ status: 200, description: 'Reward code found' }), ApiNotFound);
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
          value: { percentage: 20 },
        },
        fullUpdate: {
          summary: 'Update code and percentage',
          value: { code: 'SUMMER20', percentage: 20 },
        },
      },
    }),
    ApiResponse({ status: 200, description: 'Reward code updated successfully' }),
    ApiNotFound,
  );
}

export function DeleteRewardCodeDoc() {
  return applyDecorators(
    SlugParam,
    IdParam,
    ApiOperation({ summary: 'Delete reward code by ID' }),
    ApiResponse({ status: 200, description: 'Reward code deleted successfully' }),
    ApiNotFound,
  );
}

export function GetRewardCodeByCodeDoc() {
  return applyDecorators(SlugParam, ApiOperation({ summary: 'Get reward code by ID' }), ApiResponse({ status: 200, description: 'Reward code found' }), ApiNotFound);
}
