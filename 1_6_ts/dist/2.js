export function getUserNamings(a) {
    return {
        fullname: a.name + " " + a.surname,
        initials: a.name[0] + "." + a.surname[0],
    };
}
