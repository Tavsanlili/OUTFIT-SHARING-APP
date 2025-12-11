import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, Upload, Loader2, Image as ImageIcon } from 'lucide-react';
import itemService from '../../services/itemService'; // ✅ Doğru

const OutfitForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;

    // --- STATE ---
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        value: 12, // ⚠️ API body'sinde var (default: 12)
        tags: []   // ⚠️ API body'sinde var
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(isEditMode);

    // --- DÜZENLEME MODU: VERİLERİ ÇEK ---
    useEffect(() => {
        if (isEditMode) {
            const fetchItem = async () => {
                try {
                    const response = await itemService.getItem(id);
                    
                    // Response yapısını console'da kontrol et
                    console.log('Edit mode response:', response);
                    
                    const data = response.data || response;

                    setFormData({
                        name: data.name || '',
                        description: data.description || '',
                        value: data.value || 12,
                        tags: data.tags || []
                    });
                    
                    if (data.image || data.photoUrl) {
                        setPreviewUrl(data.image || data.photoUrl);
                    }
                } catch (error) {
                    console.error(error);
                    alert("Kayıt bilgileri yüklenemedi.");
                    navigate('/my-outfits');
                } finally {
                    setPageLoading(false);
                }
            };
            fetchItem();
        }
    }, [id, isEditMode, navigate]);

    // --- DOSYA SEÇME ---
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    // --- KAYDETME İŞLEMİ ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            let targetId = id;

            // ⚠️ ÖNEMLİ: API body'sine uygun data oluştur
            const apiData = {
                name: formData.name,
                description: formData.description,
                value: formData.value || 12,
                tags: formData.tags || []
            };

            console.log('Gönderilen data:', apiData);

            // 1. ADIM: TEXT VERİLERİNİ KAYDET
            if (isEditMode) {
                await itemService.updateItem(id, apiData);
            } else {
                const response = await itemService.addItem(apiData);
                targetId = response.id || response.data?.id;
            }

            // 2. ADIM: FOTOĞRAF VARSA YÜKLE
            if (selectedFile && targetId) {
                await itemService.addItemPhoto(targetId, {
                    file: selectedFile
                    // ⚠️ Backend'in beklediği formatı kontrol et
                });
            }

            alert(`İşlem başarıyla tamamlandı!`);
            navigate('/my-outfits');

        } catch (error) {
            console.error("Kayıt hatası:", error);
            
            const errorMsg = error.response?.data?.message 
                || error.message 
                || 'Bir hata oluştu. Lütfen tekrar deneyin.';
            
            alert(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    if (pageLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-indigo-50">
                <Loader2 className="animate-spin text-indigo-600" size={40} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                
                {/* GERİ DÖN BUTONU */}
                <button 
                    onClick={() => navigate(-1)}
                    className="flex items-center text-indigo-600 hover:text-indigo-800 mb-6 font-medium transition-colors"
                >
                    <ArrowLeft size={20} className="mr-2" />
                    Geri Dön
                </button>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-indigo-50">
                    
                    {/* HEADER */}
                    <div className="px-8 py-6 bg-indigo-600 text-white">
                        <h2 className="text-2xl font-bold">
                            {isEditMode ? 'Kombini Düzenle' : 'Yeni Kombin Oluştur'}
                        </h2>
                        <p className="text-indigo-100 mt-1 opacity-90">
                            {isEditMode ? 'Detayları güncelleyin' : 'Tarzınızı yansıtın'}
                        </p>
                    </div>

                    {/* FORM */}
                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                        
                        {/* FOTOĞRAF ALANI */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Kombin Fotoğrafı</label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-indigo-100 border-dashed rounded-xl hover:border-indigo-300 transition-colors bg-indigo-50/30 group cursor-pointer relative">
                                
                                <input 
                                    type="file" 
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    onChange={handleFileChange}
                                    accept="image/*"
                                />

                                <div className="space-y-1 text-center">
                                    {previewUrl ? (
                                        <div className="relative">
                                            <img 
                                                src={previewUrl} 
                                                alt="Preview" 
                                                className="mx-auto h-64 object-cover rounded-lg shadow-sm"
                                            />
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                                                <p className="text-white font-medium flex items-center gap-2">
                                                    <Upload size={20} /> Değiştir
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="mx-auto h-12 w-12 text-indigo-300 group-hover:text-indigo-500 transition-colors">
                                                <ImageIcon size={48} />
                                            </div>
                                            <div className="flex text-sm text-gray-600 justify-center">
                                                <span className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                                                    <span>Fotoğraf Seç</span>
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500">PNG, JPG, GIF</p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* INPUT: BAŞLIK */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Başlık</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                placeholder="Örn: Yazlık Sahil Kombini"
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                        </div>

                        {/* INPUT: AÇIKLAMA */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                            <textarea
                                rows={4}
                                required
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                placeholder="Bu kombini nerede giyersin?"
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                            />
                        </div>

                        {/* ⚠️ VALUE ALANI (Zorunlu) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Değer (Value) <span className="text-gray-400 text-xs">(API için zorunlu - Postman'de 12)</span>
                            </label>
                            <input
                                type="number"
                                value={formData.value}
                                onChange={(e) => setFormData({...formData, value: parseInt(e.target.value) || 12})}
                                placeholder="12"
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                        </div>

                        {/* ⚠️ TAGS ALANI (Opsiyonel ama body'de var) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tags <span className="text-gray-400 text-xs">(Array - şimdilik boş bırak)</span>
                            </label>
                            <input
                                type="text"
                                value={formData.tags.join(', ')}
                                onChange={(e) => setFormData({
                                    ...formData, 
                                    tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
                                })}
                                placeholder="casual, summer (virgülle ayır)"
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Tag ID'leri virgülle ayırarak girin. Örnek: "46ee2cba-45fc-4519-8ae0-b3efe2b70622"
                            </p>
                        </div>

                        {/* SUBMIT BUTON */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all disabled:opacity-70"
                            >
                                {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                                {loading ? 'İşleniyor...' : (isEditMode ? 'Kaydet' : 'Oluştur')}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default OutfitForm;