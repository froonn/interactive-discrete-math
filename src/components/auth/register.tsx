import { useState } from 'preact/hooks';
import { client } from './connect-to-sc-client'
import { generateSalt, hashPassword } from './auth-utils';


function validatePassword(password: string): string | null {
  const minLength = 8;
  const groups = [
    /[a-z]/,
    /[A-Z]/,
    /\d/,
    /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/
  ];

  if (password.length < minLength) {
    return 'Пароль должен содержать не менее 8 символов';
  }

  const matchedGroups = groups.reduce((acc, rx) => acc + Number(rx.test(password)), 0);
  if (matchedGroups < 3) {
    return 'Пароль должен содержать символы как минимум из трёх групп: строчные/заглавные латинские буквы, цифры и специальные символы';
  }

  return null;
}

async function registerUser(login: string, password: string) {

  const found = await client.searchLinksByContents([`user_${login}`]);

  if (found[0].length) {
    return { success: false, error: 'Логин уже занят' };
  }

  const salt = generateSalt();
  const doubleHash = hashPassword(password, salt);

  const res = await client.generateElementsBySCs(
    [`concept_user -> user_${login};;`,
     `user_${login} => nrel_username: ${login};;`,
     `user_${login} => nrel_hashed_password: ${doubleHash};;`,
     `user_${login} => nrel_salt: ${salt};;`]
  );

  if (res) {
    return { success: true };
  } else
    return { success: false, error: 'Неизвестная ошибка' }
}

type RegisterProps = {
  onSwitchToLogin?: () => void;
};

export const Register = ({ onSwitchToLogin }: RegisterProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: Event) => {

    console.log('Register in with:', { username, password });

    event.preventDefault();
    const err = validatePassword(password);
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    setLoading(true);
    setSuccess(false);

    const result = await registerUser(username, password);

    setLoading(false);

    if (result.success) {
      setSuccess(true);
      setUsername('');
      setPassword('');
    } else {
      setError(result.error || 'Ошибка регистрации');
    }
  };

  return (
    <div class="flex flex-col items-center justify-center h-screen">
      <form onSubmit={handleSubmit} class="bg-white p-6 rounded shadow-md w-80">
        <h2 class="mb-4 text-xl font-semibold">Регистрация</h2>
        <input
          type="text"
          value={username}
          onInput={e => setUsername((e.target as HTMLInputElement).value)}
          class="mb-2 p-2 border w-full"
          placeholder="Логин"
          required
        />
        <div class="mb-4">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onInput={e => setPassword((e.target as HTMLInputElement).value)}
            class="p-2 border w-full"
            placeholder="Пароль"
            required
          />
          <label class="flex items-center mt-2 text-sm select-none">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={e => setShowPassword((e.target as HTMLInputElement).checked)}
              class="mr-2"
            />
            Показать пароль
          </label>
          {error && <div class="text-red-600 mt-2 text-sm">{error}</div>}
          {success && <div class="text-green-600 mt-2 text-sm">Регистрация успешна!</div>}
          {loading && <div class="text-gray-600 mt-2 text-sm">Регистрация...</div>}
        </div>
        <button type="submit" class="bg-green-600 text-white px-4 py-2 rounded w-full" disabled={loading}>
          Зарегистрироваться
        </button>
        <button
          type="button"
          class="mt-2 text-sm text-blue-500 hover:underline w-full"
          onClick={onSwitchToLogin}
        >
          Уже есть аккаунт
        </button>
      </form>
    </div>
  );
};
