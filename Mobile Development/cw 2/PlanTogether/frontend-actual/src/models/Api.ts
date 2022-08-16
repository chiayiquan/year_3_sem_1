export type Api = Readonly<{
  status: number | null;
  resolve: boolean;
}>;

export const newApiPromise: Api = {
  status: null,
  resolve: false,
};

export const resolve200Promise: Api = {
  status: 200,
  resolve: true,
};

export const resolve400Promise: Api = {
  status: 400,
  resolve: true,
};

export const resolve500Promise: Api = {
  status: 500,
  resolve: true,
};
