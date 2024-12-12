import { ApolloClient, InMemoryCache, ApolloProvider, ApolloLink, HttpLink } from '@apollo/client';
import { onError } from "@apollo/client/link/error";
import { gql, useQuery as ApolloQuery, useMutation as ApolloMutation } from '@apollo/client';

const httpLink = new HttpLink({
    uri: 'https://api.example.com/graphql',
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
        graphQLErrors.forEach(({ message, locations, path }) =>
            console.log(
                `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
            ),
        );
    if (networkError) console.log(`[Network error]: ${networkError}`);
});

const client = new ApolloClient({
    link: ApolloLink.from([errorLink, httpLink]),
    cache: new InMemoryCache(),
});


// Mock data
const mockProducts = [
    { id: '1', name: 'Coffee', price: 3.99, category: 'Beverages', number_available: 10 },
    { id: '2', name: 'Tea', price: 2.99, category: 'Beverages', number_available: 10 },
    { id: '3', name: 'Sandwich', price: 6.99, category: 'Food', number_available: 10 },
    { id: '4', name: 'Salad', price: 5.99, category: 'Food', number_available: 10 },
    { id: '5', name: 'Chips', price: 1.99, category: 'Snacks', number_available: 10 },
];

const mockCategories = [
    { id: '1', name: 'Beverages' },
    { id: '2', name: 'Food' },
    { id: '3', name: 'Snacks' },
];

const mockUsers = [
    { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Admin' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'Cashier' },
];

const mockOrders = [
    { id: '1', customerName: 'Alice Johnson', date: '2023-06-01', total: 25.99, status: 'Completed' },
    { id: '2', customerName: 'Bob Smith', date: '2023-06-02', total: 34.50, status: 'Pending' },
    { id: '3', customerName: 'Charlie Brown', date: '2023-06-03', total: 19.99, status: 'Cancelled' },
];

// Mock queries
export const GET_PRODUCTS = gql`
  query GetProducts {
    products {
      id
      name
      price
      category
      isActive
    }
  }
`;

export const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      id
      name
    }
  }
`;

export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
      email
      role
      isActive
    }
  }
`;

export const GET_ORDERS = gql`
  query GetOrders {
    orders {
      id
      customerName
      date
      total
      status
    }
  }
`;

// Mock mutations
export const ADD_PRODUCT = gql`
  mutation AddProduct($input: ProductInput!) {
    addProduct(input: $input) {
      id
      name
      price
      category
      isActive
    }
  }
`;

export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($id: ID!, $input: ProductInput!) {
    updateProduct(id: $id, input: $input) {
      id
      name
      price
      category
      isActive
    }
  }
`;

export const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id) {
      id
    }
  }
`;

export const ADD_CATEGORY = gql`
  mutation AddCategory($input: CategoryInput!) {
    addCategory(input: $input) {
      id
      name
    }
  }
`;

export const UPDATE_CATEGORY = gql`
  mutation UpdateCategory($id: ID!, $input: CategoryInput!) {
    updateCategory(id: $id, input: $input) {
      id
      name
    }
  }
`;

export const DELETE_CATEGORY = gql`
  mutation DeleteCategory($id: ID!) {
    deleteCategory(id: $id) {
      id
    }
  }
`;

export const ADD_USER = gql`
  mutation AddUser($input: UserInput!) {
    addUser(input: $input) {
      id
      name
      email
      role
      isActive
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $input: UserInput!) {
    updateUser(id: $id, input: $input) {
      id
      name
      email
      role
      isActive
    }
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id) {
      id
    }
  }
`;

export const UPDATE_ORDER = gql`
  mutation UpdateOrder($id: ID!, $input: OrderInput!) {
    updateOrder(id: $id, input: $input) {
      id
      customerName
      date
      total
      status
    }
  }
`;

// Mock resolvers
export const mockResolvers = {
    Query: {
        products: () => mockProducts,
        categories: () => mockCategories,
        users: () => mockUsers,
        orders: () => mockOrders,
    },
    Mutation: {
        addProduct: (_: unknown, { input }: { input: { name: string; price: number; category: string; isActive: boolean } }) => {
            const newProduct = { id: String(mockProducts.length + 1), ...input, isActive: true, number_available: 10 };
            mockProducts.push(newProduct);
            return newProduct;
        },
        updateProduct: (_: unknown, { id, input }: { id: string; input: { name: string; price: number; category: string; isActive: boolean } }) => {
            const index = mockProducts.findIndex(p => p.id === id);
            if (index !== -1) {
                mockProducts[index] = { ...mockProducts[index], ...input };
                return mockProducts[index];
            }
            return null;
        },
        deleteProduct: (_: unknown, { id }: { id: string }) => {
            const index = mockProducts.findIndex(p => p.id === id);
            if (index !== -1) {
                mockProducts.splice(index, 1);
                return { id };
            }
            return null;
        },
        addCategory: (_: unknown, { input }: { input: { name: string } }) => {
            const newCategory = { id: String(mockCategories.length + 1), ...input };
            mockCategories.push(newCategory);
            return newCategory;
        },
        updateCategory: (_: unknown, { id, input }: { id: string; input: { name: string } }) => {
            const index = mockCategories.findIndex(c => c.id === id);
            if (index !== -1) {
                mockCategories[index] = { ...mockCategories[index], ...input };
                return mockCategories[index];
            }
            return null;
        },
        deleteCategory: (_: unknown, { id }: { id: string }) => {
            const index = mockCategories.findIndex(c => c.id === id);
            if (index !== -1) {
                mockCategories.splice(index, 1);
                return { id };
            }
            return null;
        },
        addUser: (_: unknown, { input }: { input: { name: string; email: string; role: string; isActive: boolean } }) => {
            const newUser = { id: String(mockUsers.length + 1), ...input, isActive: true };
            mockUsers.push(newUser);
            return newUser;
        },
        updateUser: (_: unknown, { id, input }: { id: string; input: { name: string; email: string; role: string; isActive: boolean } }) => {
            const index = mockUsers.findIndex(u => u.id === id);
            if (index !== -1) {
                mockUsers[index] = { ...mockUsers[index], ...input };
                return mockUsers[index];
            }
            return null;
        },
        deleteUser: (_: unknown, { id }: { id: string }) => {
            const index = mockUsers.findIndex(u => u.id === id);
            if (index !== -1) {
                mockUsers.splice(index, 1);
                return { id };
            }
            return null;
        },
        updateOrder: (_: unknown, { id, input }: { id: string; input: { customerName: string; date: string; total: number; status: string } }) => {
            const index = mockOrders.findIndex(o => o.id === id);
            if (index !== -1) {
                mockOrders[index] = { ...mockOrders[index], ...input };
                return mockOrders[index];
            }
            return null;
        },
    },
};

// Setup mock server

const useMock = true;

export const useQuery = useMock ? () => ({ loading: false, error: undefined, data: { products: mockProducts, categories: mockCategories } }) : ApolloQuery;
export const useMutation = useMock ? () => () => ({}) : ApolloMutation;


export const MockApolloProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <ApolloProvider client={client} >
            {children}
        </ApolloProvider>
    )
};

