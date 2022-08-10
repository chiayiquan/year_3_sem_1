import "react-redux";

import { RootState } from "../redux/store";

// Extend the DefaultRootState with RootState so that all component that using the state don't have to keep declaring type
declare module "react-redux" {
  interface DefaultRootState extends RootState {}
}
