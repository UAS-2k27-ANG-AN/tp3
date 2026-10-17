export interface Geo { lat: string; lng: string; }
export interface Address { street: string; suite: string; city: string; zipcode: string; geo: Geo; }
export interface Company { name: string; catchPhrase: string; bs: string; }
export interface User { id: number; name: string; username: string; email: string; phone: string; website: string; address: Address; company: Company; }

export type UserPayload = Omit<User, 'id'>;

export const emptyUser = (): UserPayload => ({
  name: '', username: '', email: '', phone: '', website: '',
  address: { street: '', suite: '', city: '', zipcode: '', geo: { lat: '', lng: '' } },
  company: { name: '', catchPhrase: '', bs: '' }
});
