import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const date = searchParams.get('date');

  // Mock database search logic
  const mockTrips = [
    {
      id: 1,
      departureTime: '08:00',
      arrivalTime: '11:30',
      duration: '3s 30d',
      price: '$45',
      busType: 'VIP Komfort',
      rating: '4.9',
      amenities: ['wifi', 'power', 'tv'],
      carrier: 'Ecolines'
    },
    {
      id: 2,
      departureTime: '13:45',
      arrivalTime: '17:15',
      duration: '3s 30d',
      price: '$38',
      busType: 'Ekonom Plus',
      rating: '4.7',
      amenities: ['wifi', 'power'],
      carrier: 'FlixBus'
    }
  ];

  return NextResponse.json(mockTrips);
}
