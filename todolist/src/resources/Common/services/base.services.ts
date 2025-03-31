/**
 * Clase base para los servicios proporciona utilidades
 * y controles básicos para los distintos métodos
 */
export abstract class BaseServices {
  private readonly baseUrl = "http://localhost:8000/api/";

  constructor(private readonly params: { resource: string }) {
    this.params.resource = `${this.baseUrl}${this.params.resource}`;
  }

  protected buildQuery(objQuery?: {
    [k: string]:
      | number
      | string
      | number[]
      | string[]
      | boolean
      | null
      | undefined;
  }): string {
    if (!objQuery) return "";

    const queryUrl = new URLSearchParams();

    Object.keys(objQuery).forEach((queryKey) => {
      const value = objQuery[queryKey];
      if (value && Array.isArray(value)) {
        value.forEach((item) => {
          queryUrl.append(`${queryKey}[]`, item?.toString());
        });
      } else if (value) {
        queryUrl.append(queryKey, value?.toString());
      }
    });
    const queryString = queryUrl?.toString();

    return queryString ? `?${queryString}` : "";
  }

  protected async get(params?: {
    url?: string | number;
    query?: {
      [k: string]:
        | number
        | string
        | number[]
        | string[]
        | boolean
        | null
        | undefined;
    };
  }) {
    const url = params?.url || "";
    const query = params?.query || undefined;
    const endpoint = `${this.params.resource}${url}${this.buildQuery(query)}`;
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  }

  protected async post(params?: {
    url?: string | number;
    data?: {
      [k: string]:
        | number
        | string
        | number[]
        | string[]
        | boolean
        | null
        | undefined;
    };
  }) {
    const url = params?.url || "";
    const endpoint = `${this.params.resource}${url}`;
    const response = await fetch(endpoint, {
      method: "POST",
      body: JSON.stringify(params?.data || {}),
      headers: {
        "Content-Type": "application/json",
        'ngrok-skip-browser-warning': "true"
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to POST: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  }

  protected async delete(params?: { url?: string | number }) {
    const url = params?.url || "";
    const endpoint = `${this.params.resource}${url}`;
    const response = await fetch(endpoint, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to DELETE: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  }

  protected async put(params?: {
    url?: string | number;
    data?: {
      [k: string]:
        | number
        | string
        | number[]
        | string[]
        | boolean
        | null
        | undefined;
    };
  }) {
    const url = params?.url || "";
    const endpoint = `${this.params.resource}${url}`;
    const response = await fetch(endpoint, {
      method: "PUT",
      body: JSON.stringify(params?.data || {}),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to PUT: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  }
}
