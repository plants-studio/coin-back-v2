export type ServerError = Error & {
  errno: number;
  code: string;
  path: string;
  syscall: string;
  stack: string;
}
