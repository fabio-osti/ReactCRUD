using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ReactCRUD.Utilities
{
	public class ApiResponse<ResponseType>
	{
		public ApiResponse(ResponseType[] response, int count)
		{
			Response = response;
			Count = count;
		}

		public ResponseType[] Response { get; }
		public int Count { get; }
	}
}
