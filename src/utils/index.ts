// 裸模块地址重写
function rewriteImport(content: string) {
  return content.replace(
    / from ['"](.*)['"]/g,
    function (s1: string, s2: string): string {
      if (s2.startsWith('./') || s2.startsWith('../') || s2.startsWith('/')) {
        return s1;
      } else {
        return ` from '/@modules/${s2}'`;
      }
    },
  );
}
export { rewriteImport };
