import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CLUB_CONFIG,
  DEALS,
  ROUNDS,
  formatRupees,
  normalizeIndianPhone,
  isValidIndianPhone,
  findNearestCity,
  getRemainingSeats,
  getRoundProgress,
  filterDealsByCity,
  validateJoinForm,
  validateDealInterestForm,
} from './clubData';

const ERR_MSGS = {
  f_err_name: 'Please enter your name.',
  f_err_phone: 'Please enter a 10-digit mobile number.',
  f_err_area: 'Please choose your area.',
  f_err_home: 'Please choose your home type.',
  f_err_consent: 'Please tick the box to continue.',
};

test('all 23 original Phase 1 deals and 5 rounds are preserved', () => {
  assert.equal(ROUNDS.length, 5);
  assert.equal(DEALS.length, 23);
  for (const deal of DEALS) {
    assert.ok(deal.image.startsWith('/images/'), `Deal ${deal.id} must have a local image path`);
    assert.ok(deal.title.length > 3);
    assert.ok(deal.ticket.includes('₹'));
  }
});

test('formatRupees formats Indian currency properly', () => {
  assert.equal(formatRupees(499), '₹499');
  assert.equal(formatRupees(999), '₹999');
  assert.equal(formatRupees(1500), '₹1,500');
});

test('phone validation and normalization handles Indian mobile numbers', () => {
  assert.equal(isValidIndianPhone('9876543210'), true);
  assert.equal(isValidIndianPhone('+91 98765 43210'), true);
  assert.equal(normalizeIndianPhone('+91 98765 43210'), '9876543210');
  assert.equal(isValidIndianPhone('1234567890'), false);
  assert.equal(isValidIndianPhone('98765'), false);
});

test('getRemainingSeats and getRoundProgress compute accurate metrics', () => {
  const seats = getRemainingSeats(1);
  assert.equal(seats.joined, 1);
  assert.equal(seats.remaining, CLUB_CONFIG.foundingSeats - 1);
  assert.equal(seats.percentFull, 0);

  const progress = getRoundProgress(10);
  assert.equal(progress.optins, 10);
  assert.equal(progress.target, 50);
  assert.equal(progress.percent, 20);
});

test('findNearestCity resolves Nagpur coordinates within 80km', () => {
  const nearNagpur = findNearestCity(21.15, 79.09);
  assert.equal(nearNagpur.city, 'Nagpur');
  assert.ok(nearNagpur.km < 5);

  const farAway = findNearestCity(12.9716, 77.5946); // Bengaluru
  assert.equal(farAway.city, 'Other');
});

test('filterDealsByCity filters multi-city vs Nagpur local crew deals', () => {
  const nagpurDeals = filterDealsByCity('Nagpur');
  assert.equal(nagpurDeals.length, 23);

  const puneDeals = filterDealsByCity('Pune');
  assert.ok(puneDeals.length < 23);
  assert.ok(puneDeals.every((d) => d.reach === 'multi'));
});

test('validateJoinForm and validateDealInterestForm enforce all required fields', () => {
  const emptyErrs = validateJoinForm(
    { name: '', phone: '123', area: '', home: '', interests: [], consent: false },
    ERR_MSGS
  );
  assert.equal(Object.keys(emptyErrs).length, 5);

  const validErrs = validateJoinForm(
    {
      name: 'Priya Deshmukh',
      phone: '9876543210',
      area: 'Dharampeth',
      home: 'house',
      interests: ['solar'],
      consent: true,
    },
    ERR_MSGS
  );
  assert.equal(Object.keys(validErrs).length, 0);

  const interestErrs = validateDealInterestForm({
    deals: [],
    name: 'A',
    phone: '555',
    city: 'Nagpur',
    consent: false,
  });
  assert.equal(Object.keys(interestErrs).length, 4);
});
