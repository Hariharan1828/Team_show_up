export const names = [
  {
    id: "John",
    image: "https://example.com/john.jpg",
    designation: "Software Engineer",
    project: "Project A",
    set: 1,
  },
  {
    id: "Alice",
    image: "https://example.com/alice.jpg",
    designation: "Data Analyst",
    project: "Project B",
    set: 2,
  },
  {
    id: "Bob",
    image: "https://example.com/bob.jpg",
    designation: "Product Manager",
    project: "Project C",
    set: 3,
  },
  // Add more data entries here...
];

export const connections = [
  { source: "John", target: "Alice", relationship: "Colleague" },
  { source: "John", target: "Bob", relationship: "Manager" },
  { source: "Alice", target: "Bob", relationship: "Collaborator" },
  // Add more data entries here...
];
