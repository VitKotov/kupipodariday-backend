import * as bcrypt from 'bcrypt';

export const isOwner = (userId: number, ownerId: number) => {
  return userId === ownerId;
};

export async function comparePassword(password, user) {
  const matched = await bcrypt.compare(password, user.password);
  if (!matched) {
    return null;
  }
  return user;
}
