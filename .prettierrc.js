module.exports = {
  tabWidth: 2,
  useTabs: false,
  importOrder: ["^date-fns", "^@/(.*)$", "^[./]"],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  plugins: ["@trivago/prettier-plugin-sort-imports"],
};
