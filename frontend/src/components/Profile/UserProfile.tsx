import { useState, useEffect } from "react";
import { User } from "../../types/User";
import { UserService } from "../../services/UserService";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "sonner";

const nationalities = [
  'Costa Rica', 'Panamá', 'Estados Unidos', 'Canadá', 'México',
  'Alemania', 'Reino Unido', 'Francia', 'España', 'Italia'
];

export function UserProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [nationality, setNationality] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    UserService.getMe().then(u => {
      setUser(u);
      setName(u.name);
      setNationality(u.nationality);
    });
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setImage(null);
      return;
    }

    const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    
    if (!validImageTypes.includes(file.type)) {
      toast.error("Solo se permiten archivos de imagen (JPG, PNG, GIF, WEBP)");
      e.target.value = '';
      setImage(null);
      return;
    }

    setImage(file);
  };

  const handleSave = async () => {
    if (password || confirmPassword) {
      if (password !== confirmPassword) {
        toast.error("Las contraseñas no coinciden");
        return;
      }
      if (password.length < 6) {
        toast.error("La contraseña debe tener al menos 6 caracteres");
        return;
      }
    }

    setLoading(true);
    const form = new FormData();
    form.append("name", name);
    form.append("nationality", nationality);
    if (image) form.append("image", image);
    
    if (password) {
      form.append("password", password);
    }

    try {
      const updated = await UserService.updateMe(form);
      setUser(updated.user);
      toast.success("Perfil actualizado");
      setImage(null);
      setPassword("");
      setConfirmPassword("");
    } catch {
      toast.error("Error actualizando perfil");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-lg mx-auto flex flex-col gap-6">
      <h2 className="text-2xl font-bold mb-2 text-center">Mi Perfil</h2>
      <div className="flex flex-col items-center gap-2">
        {user?.image_path ? (
          <img
            src={`/api/uploads/users/${user.image_path}`}
            alt="Perfil"
            className="w-24 h-24 rounded-full object-cover border"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-3xl text-gray-400">
            <span>{user?.name?.[0]?.toUpperCase() || "U"}</span>
          </div>
        )}
        <Input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="mt-2"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Cédula/Pasaporte</label>
          <Input value={user?.id_document || ""} disabled />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Correo</label>
          <Input value={user?.email || ""} disabled />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Nombre</label>
          <Input value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Nacionalidad</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={nationality}
            onChange={e => setNationality(e.target.value)}
          >
            <option value="">Seleccione una nacionalidad</option>
            {nationalities.map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Nueva Contraseña</label>
          <Input 
            type="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)}
            placeholder="Dejar vacío para mantener actual"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Confirmar Contraseña</label>
          <Input 
            type="password" 
            value={confirmPassword} 
            onChange={e => setConfirmPassword(e.target.value)}
            placeholder="Confirmar nueva contraseña"
          />
        </div>
      </div>
      <Button onClick={handleSave} disabled={loading} className="w-full mt-2">
        {loading ? "Guardando..." : "Guardar"}
      </Button>
    </div>
  );
}