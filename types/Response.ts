export type Response = {
  data: {
    __v_isShallow: boolean;
    __v_isRef: boolean;
    _rawValue: any; // Adjust the type according to your data
    _value: any; // Adjust the type according to your data
  };
  pending: {
    __v_isShallow: boolean;
    __v_isRef: boolean;
    _rawValue: boolean;
    _value: boolean;
  };
  error: {
    _object: {
      [key: string]: any; // Adjust the type according to your data
    };
    _key: string;
    __v_isRef: boolean;
  };
  status: {
    __v_isShallow: boolean;
    __v_isRef: boolean;
    _rawValue: string;
    _value: string;
  };
};
