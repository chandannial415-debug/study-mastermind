  useEffect(() => {
    async function fetchNotes() {
      setLoading(true);
      
      // यह लाइन चेक करेगी कि क्या सच में डेटा मिल रहा है
      const { data, error } = await supabase
        .from('notes')
        .select('*') // 'content' की जगह '*' करें ताकि पूरा डेटा दिखे
        .eq('subject_name', subjectName)
        .eq('chapter_name', chapterName)
        .eq('file_type', 'Small Notebook')
        .single();

      if (error) {
        console.log("Supabase Error:", error.message);
      } else {
        console.log("Supabase Data:", data); // यहाँ डेटा दिखेगा
        setNote(data);
      }
      setLoading(false);
    }
    fetchNotes();
  }, [chapterId, chapterName, subjectName]);
