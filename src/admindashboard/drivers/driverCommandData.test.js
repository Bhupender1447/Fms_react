import { contactDraft, dateAttention, dateLabel, driverName, photoUrl, validDate, validateContact } from './driverCommandData';

test('only verified contact columns enter the editable draft and schema lengths are enforced', () => {
  const draft = contactDraft({ id: '11', fname: 'Alex', password: 'not-for-ui', documentno: 'restricted', accountno: 'restricted' });
  expect(draft).not.toHaveProperty('id');
  expect(draft).not.toHaveProperty('password');
  expect(draft).not.toHaveProperty('documentno');
  expect(draft).not.toHaveProperty('accountno');
  expect(validateContact({ ...draft, fname: ' ', email: 'bad', phone: '1'.repeat(51) })).toEqual({
    fname: 'First name is required.', email: 'Enter a valid email address.', phone: 'Use 50 characters or fewer.',
  });
  expect(validateContact({ ...draft, email: 'x'.repeat(61) })).toHaveProperty('email', 'Use 60 characters or fewer.');
  expect(validateContact(draft)).toEqual({});
});

test('invalid and absent dates remain unavailable and unknown checks are never cleared', () => {
  expect(validDate('2026-02-31')).toBeNull();
  expect(validDate('0000-00-00')).toBeNull();
  expect(dateLabel('not a date')).toBe('Unavailable (invalid date)');
  expect(dateLabel(null)).toBe('Unavailable');
  expect(dateAttention({}, new Date('2026-10-25T12:00:00'))).toBeNull();
  expect(dateAttention({ expiarydate: '2026-11-06', fastexpdate: '2099-01-01' }, new Date('2026-10-25T12:00:00'))).toBe(true);
  expect(dateAttention({ expiarydate: '2099-01-01' }, new Date('2026-10-25T12:00:00'))).toBeNull();
});

test('avatar URLs reject executable and third-party resources', () => {
  // eslint-disable-next-line no-script-url -- exercise rejection of persisted executable URLs
  expect(photoUrl('javascript:alert(1)')).toBeNull();
  expect(photoUrl('https://third-party.example/driver.jpg')).toBeNull();
  expect(photoUrl('data:image/svg+xml,test')).toBeNull();
  expect(photoUrl('')).toBeNull();
  expect(photoUrl('/photo.jpg')).toMatch(/\/photo\.jpg$/);
  expect(driverName({})).toBe('Unnamed driver');
});
