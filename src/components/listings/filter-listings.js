export default function getUserListings (listings, id) {
  if (!listings) { return listings }

  return listings.filter((p) => p.user.id === id)
}
