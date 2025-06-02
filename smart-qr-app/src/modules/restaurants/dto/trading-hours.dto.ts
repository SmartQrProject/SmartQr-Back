import { IsOptional, IsString, ValidateIf, Matches, ValidateNested } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class DayHoursDto {
  @ApiPropertyOptional({ example: '09:00' })
  @IsOptional()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Open must be in HH:mm format',
  })
  @ValidateIf((o) => o.close !== undefined)
  open?: string;

  @ApiPropertyOptional({ example: '18:00' })
  @IsOptional()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Close must be in HH:mm format',
  })
  @ValidateIf((o) => o.open !== undefined)
  close?: string;
}

export class TradingHoursDto {
  @ApiPropertyOptional({ type: () => DayHoursDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => DayHoursDto)
  mondayToFriday?: DayHoursDto;

  @ApiPropertyOptional({ type: () => DayHoursDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => DayHoursDto)
  saturday?: DayHoursDto;

  @ApiPropertyOptional({ type: () => DayHoursDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => DayHoursDto)
  sunday?: DayHoursDto;
}
