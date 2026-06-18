import { httpsCallable, type HttpsCallableResult } from 'firebase/functions'
import { firebaseFunctions } from './firebase/firebase.functions'
import { handleError } from '../utils/errorHandler'

export async function callFunction<TRequest, TResponse>(
  name: string,
  data: TRequest
): Promise<TResponse> {
  try {
    const callable = httpsCallable<TRequest, TResponse>(firebaseFunctions, name)
    const result: HttpsCallableResult<TResponse> = await callable(data)
    return result.data
  } catch (error) {
    throw new Error(handleError(`callFunction:${name}`, error), { cause: error })
  }
}
