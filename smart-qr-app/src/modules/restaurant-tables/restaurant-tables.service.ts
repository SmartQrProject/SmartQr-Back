import { Injectable } from '@nestjs/common';
import { CreateRestaurantTableDto } from './dto/create-restaurant-table.dto';
import { UpdateRestaurantTableDto } from './dto/update-restaurant-table.dto';

@Injectable()
export class RestaurantTablesService {
  create(createRestaurantTableDto: CreateRestaurantTableDto) {
    return 'This action adds a new restaurantTable';
  }

  findAll() {
    const mockRestaurantTables = [
      {
        id: '85dbb533-1d56-470a-bd01-82bfbc3f03e3',
        code: 'T1',
        is_active: true,
        created_at: '2025-05-14T09:56:22.576798',
        orders: [],
        restaurant: {
          id: '674e111b-7bca-4126-8096-2764a34d6352',
          name: 'Francafe',
        },
        exist: true,
      },
      {
        id: '50f8c760-5a1d-48bf-9a92-7fccb8b665b5',
        code: 'T2',
        is_active: true,
        created_at: '2025-05-12T09:56:22.577039',
        orders: [],
        restaurant: {
          id: '674e111b-7bca-4126-8096-2764a34d6352',
          name: 'Francafe',
        },
        exist: true,
      },
      {
        id: '15fbffb3-6fa5-407f-a605-95a5e0036ede',
        code: 'T3',
        is_active: true,
        created_at: '2025-05-01T09:56:22.577114',
        orders: [],
        restaurant: {
          id: '674e111b-7bca-4126-8096-2764a34d6352',
          name: 'Francafe',
        },
        exist: true,
      },
      {
        id: '0f994978-94d2-43fd-b4d8-17ec65b60fe1',
        code: 'T4',
        is_active: true,
        created_at: '2025-04-23T09:56:22.577216',
        orders: [],
        restaurant: {
          id: '674e111b-7bca-4126-8096-2764a34d6352',
          name: 'Francafe',
        },
        exist: true,
      },
      {
        id: '6d15f387-09e0-4adc-9b34-c3556e941c1e',
        code: 'T5',
        is_active: false,
        created_at: '2025-05-12T09:56:22.577269',
        orders: [],
        restaurant: {
          id: '674e111b-7bca-4126-8096-2764a34d6352',
          name: 'Francafe',
        },
        exist: true,
      },
      {
        id: 'b7591959-4606-4e0b-b0da-9ae36393bf72',
        code: 'T6',
        is_active: true,
        created_at: '2025-05-05T09:56:22.577299',
        orders: [],
        restaurant: {
          id: '674e111b-7bca-4126-8096-2764a34d6352',
          name: 'Francafe',
        },
        exist: true,
      },
      {
        id: '472a0371-718d-4ae8-833f-a6589cdcc317',
        code: 'T7',
        is_active: true,
        created_at: '2025-05-05T09:56:22.577332',
        orders: [],
        restaurant: {
          id: '674e111b-7bca-4126-8096-2764a34d6352',
          name: 'Francafe',
        },
        exist: true,
      },
      {
        id: '84d8ff59-ecdb-4a6e-8823-628a5377f9ca',
        code: 'T8',
        is_active: true,
        created_at: '2025-05-07T09:56:22.577355',
        orders: [],
        restaurant: {
          id: '674e111b-7bca-4126-8096-2764a34d6352',
          name: 'Francafe',
        },
        exist: true,
      },
      {
        id: 'f5958c68-adad-4e01-990d-2d3e4e97cc21',
        code: 'T9',
        is_active: true,
        created_at: '2025-05-10T09:56:22.577393',
        orders: [],
        restaurant: {
          id: '674e111b-7bca-4126-8096-2764a34d6352',
          name: 'Francafe',
        },
        exist: true,
      },
      {
        id: '030535d4-d544-4f9e-9f4e-22f09e133827',
        code: 'T10',
        is_active: false,
        created_at: '2025-05-02T09:56:22.577427',
        orders: [],
        restaurant: {
          id: '674e111b-7bca-4126-8096-2764a34d6352',
          name: 'Francafe',
        },
        exist: true,
      },
      {
        id: '8277d826-c6b4-4f5d-9217-7b573bd07c90',
        code: 'T11',
        is_active: true,
        created_at: '2025-05-04T09:56:22.577460',
        orders: [],
        restaurant: {
          id: '674e111b-7bca-4126-8096-2764a34d6352',
          name: 'Francafe',
        },
        exist: true,
      },
      {
        id: 'eccfa312-5555-482f-a568-5b5383287338',
        code: 'T12',
        is_active: true,
        created_at: '2025-04-18T09:56:22.577489',
        orders: [],
        restaurant: {
          id: '674e111b-7bca-4126-8096-2764a34d6352',
          name: 'Francafe',
        },
        exist: true,
      },
      {
        id: 'b7c1ec59-4405-4d08-ae3d-6c33125993a8',
        code: 'T13',
        is_active: true,
        created_at: '2025-04-24T09:56:22.577528',
        orders: [],
        restaurant: {
          id: '674e111b-7bca-4126-8096-2764a34d6352',
          name: 'Francafe',
        },
        exist: true,
      },
      {
        id: '40e111c8-cc51-45ec-823c-023c32a1e50e',
        code: 'T14',
        is_active: true,
        created_at: '2025-05-03T09:56:22.577562',
        orders: [],
        restaurant: {
          id: '674e111b-7bca-4126-8096-2764a34d6352',
          name: 'Francafe',
        },
        exist: true,
      },
      {
        id: '09a336c8-64b0-4c78-87eb-555e2c2cbf91',
        code: 'T15',
        is_active: true,
        created_at: '2025-05-10T09:56:22.577603',
        orders: [],
        restaurant: {
          id: '674e111b-7bca-4126-8096-2764a34d6352',
          name: 'Francafe',
        },
        exist: true,
      },
      {
        id: 'b56dc03e-b7b4-46c9-ada0-176e1ea24724',
        code: 'T16',
        is_active: false,
        created_at: '2025-05-16T09:56:22.577638',
        orders: [],
        restaurant: {
          id: '674e111b-7bca-4126-8096-2764a34d6352',
          name: 'Francafe',
        },
        exist: true,
      },
      {
        id: 'b4320393-7148-4060-b472-65a29399e34a',
        code: 'T17',
        is_active: true,
        created_at: '2025-04-19T09:56:22.577667',
        orders: [],
        restaurant: {
          id: '674e111b-7bca-4126-8096-2764a34d6352',
          name: 'Francafe',
        },
        exist: true,
      },
      {
        id: 'd40030c2-ce05-4be7-8f99-64098c563221',
        code: 'T18',
        is_active: true,
        created_at: '2025-04-29T09:56:22.577692',
        orders: [],
        restaurant: {
          id: '674e111b-7bca-4126-8096-2764a34d6352',
          name: 'Francafe',
        },
        exist: true,
      },
      {
        id: '9287f0a8-5e79-4b4d-820e-97b24a57c60d',
        code: 'T19',
        is_active: true,
        created_at: '2025-04-23T09:56:22.577724',
        orders: [],
        restaurant: {
          id: '674e111b-7bca-4126-8096-2764a34d6352',
          name: 'Francafe',
        },
        exist: true,
      },
      {
        id: 'c9921dcd-b9a7-4037-8541-3d9dad95d2a7',
        code: 'T20',
        is_active: true,
        created_at: '2025-05-01T09:56:22.577747',
        orders: [],
        restaurant: {
          id: '674e111b-7bca-4126-8096-2764a34d6352',
          name: 'Francafe',
        },
        exist: true,
      },
      {
        id: '68df5c56-46ee-4e6e-aa25-3210b1f5ced6',
        code: 'T21',
        is_active: true,
        created_at: '2025-05-10T09:56:22.577888',
        orders: [],
        restaurant: {
          id: '674e111b-7bca-4126-8096-2764a34d6352',
          name: 'Francafe',
        },
        exist: true,
      },
      {
        id: '278f3ee5-d41c-4738-818f-9dc2138fe00d',
        code: 'T22',
        is_active: true,
        created_at: '2025-04-19T09:56:22.577941',
        orders: [],
        restaurant: {
          id: '674e111b-7bca-4126-8096-2764a34d6352',
          name: 'Francafe',
        },
        exist: true,
      },
      {
        id: '7ae11078-00fb-47d1-8c92-cbb827cebe95',
        code: 'T23',
        is_active: true,
        created_at: '2025-05-04T09:56:22.577954',
        orders: [],
        restaurant: {
          id: '674e111b-7bca-4126-8096-2764a34d6352',
          name: 'Francafe',
        },
        exist: true,
      },
      {
        id: 'f7420aef-1728-4fde-b1f8-df46b4e8382e',
        code: 'T24',
        is_active: true,
        created_at: '2025-04-19T09:56:22.577965',
        orders: [],
        restaurant: {
          id: '674e111b-7bca-4126-8096-2764a34d6352',
          name: 'Francafe',
        },
        exist: true,
      },
      {
        id: 'dadcd016-9d82-447e-8049-4e0478586314',
        code: 'T25',
        is_active: true,
        created_at: '2025-04-30T09:56:22.577976',
        orders: [],
        restaurant: {
          id: '674e111b-7bca-4126-8096-2764a34d6352',
          name: 'Francafe',
        },
        exist: true,
      },
      {
        id: '09e151d8-ea9c-46ad-8979-83683a94f0ed',
        code: 'T26',
        is_active: true,
        created_at: '2025-04-26T09:56:22.577988',
        orders: [],
        restaurant: {
          id: '674e111b-7bca-4126-8096-2764a34d6352',
          name: 'Francafe',
        },
        exist: true,
      },
      {
        id: '40a894fd-ac6f-4eca-8d37-cf606a5e0d1d',
        code: 'T27',
        is_active: false,
        created_at: '2025-05-10T09:56:22.578000',
        orders: [],
        restaurant: {
          id: '674e111b-7bca-4126-8096-2764a34d6352',
          name: 'Francafe',
        },
        exist: true,
      },
      {
        id: 'e38b4b90-a843-41c8-9216-654b59d281cc',
        code: 'T28',
        is_active: false,
        created_at: '2025-05-03T09:56:22.578036',
        orders: [],
        restaurant: {
          id: '674e111b-7bca-4126-8096-2764a34d6352',
          name: 'Francafe',
        },
        exist: true,
      },
      {
        id: '66e4ce65-9bbf-4bc2-b3a6-194048923e24',
        code: 'T29',
        is_active: false,
        created_at: '2025-05-04T09:56:22.578051',
        orders: [],
        restaurant: {
          id: '674e111b-7bca-4126-8096-2764a34d6352',
          name: 'Francafe',
        },
        exist: true,
      },
      {
        id: '42a16fa8-f840-4639-ad44-5d818389d97e',
        code: 'T30',
        is_active: true,
        created_at: '2025-05-09T09:56:22.578061',
        orders: [],
        restaurant: {
          id: '674e111b-7bca-4126-8096-2764a34d6352',
          name: 'Francafe',
        },
        exist: true,
      },
    ];

    return mockRestaurantTables;
  }

  findOne(id: number) {
    return `This action returns a #${id} restaurantTable`;
  }

  update(id: number, updateRestaurantTableDto: UpdateRestaurantTableDto) {
    return `This action updates a #${id} restaurantTable`;
  }

  remove(id: number) {
    return `This action removes a #${id} restaurantTable`;
  }
}
