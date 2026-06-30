// 2.
type User = {
  name: string;
  surname: string;
};
export function getUserNamings(a: User) {
  return {
    fullname: a.name + " " + a.surname,
    initials: a.name[0] + "." + a.surname[0],
  };
}
